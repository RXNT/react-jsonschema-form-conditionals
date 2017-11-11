import { extractRefSchema } from "json-rules-engine-simplified/lib/utils";
import { deepEquals } from "react-jsonschema-form/lib/utils";

export const isDevelopment = () => {
  return process.env.NODE_ENV !== "production";
};

function fieldWithPrefix(field, prefix) {
  return prefix ? `${prefix}.${field}` : field;
}

export function activeField(formData = {}, changedFormData = {}, prefix) {
  let existingFields = Object.keys(formData);
  let diffField = existingFields.find(
    field => !deepEquals(formData[field], changedFormData[field])
  );
  if (diffField) {
    let diffFieldVal = formData[diffField];
    if (Array.isArray(diffFieldVal)) {
      return undefined;
    } else if (typeof diffFieldVal === "object") {
      return activeField(
        diffFieldVal,
        changedFormData[diffField],
        fieldWithPrefix(diffField, prefix)
      );
    } else {
      return fieldWithPrefix(diffField, prefix);
    }
  }

  let newField = Object.keys(changedFormData).find(
    field => !existingFields.includes(field)
  );
  if (newField) {
    let newFieldVal = changedFormData[newField];
    if (Array.isArray(newFieldVal)) {
      return undefined;
    } else if (typeof newFieldVal === "object") {
      return activeField({}, newFieldVal, fieldWithPrefix(newField, prefix));
    } else {
      return fieldWithPrefix(newField, prefix);
    }
  }
}

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
  let refSchema = extractRefSchema(parentField, schema);
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
