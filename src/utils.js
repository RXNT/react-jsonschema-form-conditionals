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

export const validateFields = (action, fetchFields) => {
  if (!fetchFields) {
    toError("validateFields requires toFields function");
    return;
  }
  return (params, { properties }) => {
    let relFields = toArray(fetchFields(params));
    relFields
      .filter(field => properties && properties[field] === undefined)
      .forEach(field =>
        toError(`Field  "${field}" is missing from schema on "${action}"`)
      );
  };
};

const fetchSchema = (ref, schema) => {
  if (ref.startsWith("#/")) {
    ref.substr(2).split("/");
    return ref
      .substr(2)
      .split("/")
      .reduce((schema, field) => schema[field], schema);
  } else {
    toError("Only local references supported at this point");
    return undefined;
  }
};

const toRefField = (field, { properties }) => {
  if (properties[field]) {
    if (properties[field]["$ref"]) {
      return properties[field]["$ref"];
    } else if (properties[field].items && properties[field].items["$ref"]) {
      return properties[field].items["$ref"];
    }
  }
  return undefined;
};

export const findRelSchema = (field, schema) => {
  let separator = field.indexOf(".");
  if (separator === -1) {
    let ref = toRefField(field, schema);
    return ref ? fetchSchema(ref, schema) : schema;
  } else {
    let parentField = field.substr(0, separator);
    let ref = toRefField(parentField, schema);
    if (ref) {
      let refSchema = fetchSchema(ref, schema);
      return findRelSchema(field.substr(separator + 1), refSchema);
    } else {
      return schema;
    }
  }
};
