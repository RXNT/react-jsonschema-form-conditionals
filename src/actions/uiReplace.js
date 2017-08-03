import { isDevelopment, validateFields } from "../utils";
import PropTypes from "prop-types";

/**
 * Replace original field in uiSchema with defined configuration
 *
 * @param field
 * @param schema
 * @param uiSchema
 * @param conf
 * @returns {{schema: *, uiSchema: *}}
 */
export default function uiReplace(params, schema, uiSchema) {
  Object.keys(params).forEach(f => {
    uiSchema[f] = params[f];
  });
}

if (isDevelopment()) {
  uiReplace.propTypes = PropTypes.object.isRequired;
  uiReplace.validate = validateFields("uiReplace", function(params) {
    return Object.keys(params);
  });
}
