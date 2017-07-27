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
