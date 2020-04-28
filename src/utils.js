import { extractRefSchema } from "json-rules-engine-simplified/lib/utils";
import env from "./env";

export const toArray = (field) => {
  if (Array.isArray(field)) {
    return field;
  } else {
    return [field];
  }
};

export const toError = (message) => {
  if (env.isDevelopment()) {
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
  let refSchema;
  try {
    refSchema = extractRefSchema(parentField, schema);
  } catch (e) {
    refSchema = null;
  }
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
