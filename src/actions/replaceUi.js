/**
 * Replace original field in uiSchema with defined configuration
 *
 * @param field
 * @param schema
 * @param uiSchema
 * @param conf
 * @returns {{schema: *, uiSchema: *}}
 */
export default function replaceUi({ fields, conf }, schema, uiSchema) {
  fields.forEach(field => {
    uiSchema[field] = conf;
  });
}
