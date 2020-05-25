import { toArray, findRelSchemaAndField } from "../utils";
import { validateFields } from "./validateAction";
import PropTypes from "prop-types";

function doRequire({ field, schema }) {
  if (!schema.required) {
    schema.required = [];
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
export default function requireFn({ field }, schema) {
  let fieldArr = toArray(field);
  toArray(fieldArr).forEach((field) =>
    doRequire(findRelSchemaAndField(field, schema))
  );
}

requireFn.propTypes = {
  field: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
};

requireFn.validate = validateFields("require", function ({ field }) {
  return field;
});
