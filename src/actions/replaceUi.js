/**
 * Replace original field in uiSchema with defined configuration
 *
 * @param field
 * @param schema
 * @param uiSchema
 * @param conf
 * @returns {{schema: *, uiSchema: *}}
 */
export default function replaceUi(field, schema = {}, uiSchema = {}, conf = {}) {
  uiSchema[field] = conf;
  return { schema, uiSchema };
}