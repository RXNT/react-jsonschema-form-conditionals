import { isDevelopment, validateFields } from "../utils";
import PropTypes from "prop-types";

function doRequire(f, schema) {
  if (schema.properties[f] === undefined) {
    console.error(`${f} is missing from the schema, and can't be required`);
  }

  if (schema.required.indexOf(f) === -1) {
    schema.required.push(f);
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
  if (!schema.required) {
    schema.required = [];
  }

  if (Array.isArray(field)) {
    field.forEach(f => doRequire(f, schema));
  } else {
    doRequire(field, schema);
  }
}

if (isDevelopment()) {
  require.propTypes = {
    field: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
  };

  require.validate = validateFields("require");
}
