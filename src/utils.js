export const OBJECT = "object";

export const isDevelopment = () => {
  return process.env.NODE_ENV !== "production";
};

const isFunction = f => typeof f === "function";

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

const hasField = (field, schema) => {
  let separator = field.indexOf(".");
  if (separator === -1) {
    return schema.properties[field] !== undefined;
  } else {
    let parentField = field.substr(0, separator);
    let refSch = toRefSchema(parentField, schema);
    if (refSch) {
      let refSchema = fetchRefSchema(refSch, schema);
      return refSchema
        ? hasField(field.substr(separator + 1), refSchema)
        : false;
    } else {
      toError(`Failed to find ${refSch} for ${field}`);
      return false;
    }
  }
};

export const validateFields = (action, fetchFields) => {
  if (!fetchFields) {
    toError("validateFields requires fetchFields function");
    return;
  }
  return (params, schema) => {
    let relFields = isFunction(fetchFields)
      ? toArray(fetchFields(params))
      : toArray(fetchFields);
    relFields
      .filter(field => !hasField(field, schema))
      .forEach(field =>
        toError(`Field "${field}" is missing from schema on "${action}"`)
      );
  };
};

const fetchRefSchema = (ref, schema) => {
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

const toRefSchema = (field, { properties }) => {
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

export const findParentSchema = (field, schema) => {
  let separator = field.indexOf(".");
  if (separator === -1) {
    let refSch = toRefSchema(field, schema);
    return refSch ? fetchRefSchema(refSch, schema) : schema;
  } else {
    let parentField = field.substr(0, separator);
    let refSch = toRefSchema(parentField, schema);
    if (refSch) {
      let refSchema = fetchRefSchema(refSch, schema);
      return refSchema
        ? findParentSchema(field.substr(separator + 1), refSchema)
        : schema;
    } else {
      toError(`Failed to find ${refSch}`);
      return schema;
    }
  }
};
