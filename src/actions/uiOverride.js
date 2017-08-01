import { isDevelopment, validateFields, findRelUiSchema } from "../utils";
import PropTypes from "prop-types";

/**
 * Override original field in uiSchema with defined configuration
 *
 * @param field
 * @param schema
 * @param uiSchema
 * @param conf
 * @returns {{schema: *, uiSchema: *}}
 */
export default function uiOverride(params, schema, uiSchema) {
  Object.keys(params).forEach(f => {
    let fieldUiSchema = findRelUiSchema(f, uiSchema);
    Object.assign(fieldUiSchema, params[f]);
  });
}

if (isDevelopment()) {
  uiOverride.propTypes = PropTypes.object.isRequired;
  uiOverride.validate = validateFields("uiReplace");
}
