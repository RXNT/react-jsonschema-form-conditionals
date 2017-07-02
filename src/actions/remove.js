/**
 * Remove specified field both from uiSchema and schema
 *
 * @param fields
 * @param schema
 * @param uiSchema
 * @returns {{schema: *, uiSchema: *}}
 */
export default function remove({ fields }, schema, uiSchema) {
  fields.forEach(field => {
    let requiredIndex = schema.required ? schema.required.indexOf(field) : -1;
    if (requiredIndex !== -1) {
      schema.required.splice(requiredIndex);
    }
    delete schema.properties[field];
    delete uiSchema[field];
  });
}
