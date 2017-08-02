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

function fetchSchema(ref, schema) {
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
}

function toRefField(field, { properties }) {
  if (properties[field]) {
    if (properties[field]["$ref"]) {
      return properties[field]["$ref"];
    } else if (properties[field].items && properties[field].items["$ref"]) {
      return properties[field].items["$ref"];
    }
  }
  return undefined;
}

export function findRelSchema(field, schema) {
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
