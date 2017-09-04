import {
  isDevelopment,
  validateFields,
  toArray,
  findParentSchema,
} from "../utils";
import PropTypes from "prop-types";

function doRemove(field, schema, uiSchema) {
  let requiredIndex = schema.required ? schema.required.indexOf(field) : -1;
  if (requiredIndex !== -1) {
    schema.required.splice(requiredIndex);
  }
  delete schema.properties[field];
  delete uiSchema[field];
}

/**
 * Remove specified field both from uiSchema and schema
 *
 * @param field
 * @param schema
 * @param uiSchema
 * @returns {{schema: *, uiSchema: *}}
 */
export default function remove({ field }, schema, uiSchema) {
  toArray(field).forEach(field =>
    doRemove(field, findParentSchema(field, schema), uiSchema)
  );
}

if (isDevelopment()) {
  remove.propTypes = {
    field: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
  };

  remove.validate = validateFields("remove", function({ field }) {
    return field;
  });
}
