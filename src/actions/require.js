import {
  isDevelopment,
  validateFields,
  toArray,
  findRelSchemaAndField,
} from "../utils";
import PropTypes from "prop-types";

function doRequire({ field, schema }) {
  if (!schema.required) {
    schema.required = [];
  }

  if (schema.properties[field] === undefined) {
    console.error(`${field} is missing from the schema, and can't be required`);
  }

  if (schema.required.indexOf(field) === -1) {
    schema.required.push(field);
  }
}

/**
 * Makes provided field required
 *
 * @param params
 * @param schema
 * @param uiSchema
 * @returns {{schema: *, uiSchema: *}}
 */
export default function require({ field }, schema) {
  let fieldArr = toArray(field);
  toArray(fieldArr).forEach(field =>
    doRequire(findRelSchemaAndField(field, schema))
  );
}

if (isDevelopment()) {
  require.propTypes = {
    field: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
  };

  require.validate = validateFields("require", function({ field }) {
    return field;
  });
}
