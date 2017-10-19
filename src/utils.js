export const OBJECT = "object";

export const isDevelopment = () => {
  return process.env.NODE_ENV !== "production";
};

export const toArray = field => {
  if (Array.isArray(field)) {
    return field;
  } else {
    return [field];
  }
};

export const toError = message => {
  if (isDevelopment()) {
    throw new ReferenceError(message);
  } else {
    console.error(message);
  }
};

export const fetchRefSchema = (ref, schema) => {
  if (ref.startsWith("#/")) {
    ref.substr(2).split("/");
    return ref
      .substr(2)
      .split("/")
      .reduce((schema, field) => schema[field], schema);
  } else if (schema.properties[ref] && schema.properties[ref].type === OBJECT) {
    return schema.properties[ref];
  } else {
    toError("Only local references supported at this point");
    return undefined;
  }
};

export const toRefSchema = (field, { properties }) => {
  if (properties[field]) {
    if (properties[field]["$ref"]) {
      return properties[field]["$ref"];
    } else if (properties[field].items && properties[field].items["$ref"]) {
      return properties[field].items["$ref"];
    } else if (properties[field].type === OBJECT) {
      return field;
    }
  }
  return undefined;
};

/**
 * Find relevant schema for the field
 * @returns { field: "string", schema: "object" } relevant field and schema
 */
export const findRelSchemaAndField = (field, schema) => {
  let separator = field.indexOf(".");
  if (separator === -1) {
    return { field, schema };
  }

  let parentField = field.substr(0, separator);
  let refSch = toRefSchema(parentField, schema);
  if (!refSch) {
    toError(`Failed to find ${refSch}`);
    return { field, schema };
  }

  let refSchema = fetchRefSchema(refSch, schema);
  if (refSchema) {
    return findRelSchemaAndField(field.substr(separator + 1), refSchema);
  }

  toError(`Failed to retrieve ${refSchema} from schema`);
  return { field, schema };
};

export function findRelUiSchema(field, uiSchema) {
  let separator = field.indexOf(".");
  if (separator === -1) {
    return uiSchema;
  }

  let parentField = field.substr(0, separator);
  let refUiSchema = uiSchema[parentField];
  if (!refUiSchema) {
    return uiSchema;
  } else {
    return findRelUiSchema(field.substr(separator + 1), refUiSchema);
  }
}
