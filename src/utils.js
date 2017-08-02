export function isDevelopment() {
  return process.env.NODE_ENV !== "production";
}

export function toArray(field) {
  if (Array.isArray(field)) {
    return field;
  } else {
    return [field];
  }
}

export function toError(message) {
  if (isDevelopment()) {
    throw new ReferenceError(message);
  } else {
    console.error(message);
  }
}

export function validateFields(action, toFields = ({ field }) => field) {
  return function(params, schema) {
    let field = toFields(params);
    if (Array.isArray(field)) {
      field
        .filter(
          f => schema && schema.properties && schema.properties[f] === undefined
        )
        .forEach(f =>
          toError(`Field  "${f}" is missing from schema on "${action}"`)
        );
    } else if (
      field.indexOf(".") === -1 &&
      schema &&
      schema.properties &&
      schema.properties[field] === undefined
    ) {
      toError(`Field  "${field}" is missing from schema on "${action}"`);
    }
  };
}

export function findRelSchema(field, schema) {
  let separator = field.indexOf(".");
  if (separator === -1) {
    if (schema.properties[field]["$ref"]) {
      return schema.definitions[field];
    } else {
      return schema;
    }
  } else {
    let parentField = field.substr(0, separator);
    return findRelSchema(
      field.substr(separator + 1),
      schema.definitions[parentField]
    );
  }
}

export function findRelForm(field, formData = {}) {
  let separator = field.indexOf(".");
  if (separator === -1) {
    return formData;
  } else {
    let parentField = field.substr(0, separator);
    return findRelForm(field.substr(separator + 1), formData[parentField]);
  }
}
