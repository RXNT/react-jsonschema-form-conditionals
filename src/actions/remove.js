/**
 * Remove specified field both from uiSchema and schema
 *
 * @param field
 * @param schema
 * @param uiSchema
 * @returns {{schema: *, uiSchema: *}}
 */
export default function remove(field, schema, uiSchema) {
  delete schema.properties[field];
  delete uiSchema[field];
  return { schema, uiSchema };
}