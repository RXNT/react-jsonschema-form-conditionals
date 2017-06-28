/**
 * Makes provided field required
 *
 * @param field
 * @param schema
 * @param uiSchema
 * @returns {{schema: *, uiSchema: *}}
 */
export default function require(field, schema, uiSchema) {
  if (!schema.required) {
    schema.required = [];
  }
  if (schema.required.indexOf(field) == -1) {
    schema.required.push(field);
  }
  return { schema, uiSchema };
}