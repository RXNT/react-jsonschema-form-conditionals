/**
 * Makes provided field required
 *
 * @param params
 * @param schema
 * @param uiSchema
 * @returns {{schema: *, uiSchema: *}}
 */
export default function require({ fields }, schema) {
  if (!schema.required) {
    schema.required = [];
  }

  fields.forEach(field => {
    // If field is missing from schema don't add it to required, since it will make a form invalid
    if (schema.properties[field] === undefined) {
      console.error(
        `${field} is missing from the schema, and can't be required`
      );
    }

    if (schema.required.indexOf(field) === -1) {
      schema.required.push(field);
    }
  });
}
