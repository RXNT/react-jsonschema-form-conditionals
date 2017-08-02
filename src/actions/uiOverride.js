import { isDevelopment, validateFields } from "../utils";
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
function doOverride(uiSchema, params) {
  Object.keys(params).forEach(field => {
    let appendVal = params[field];
    let fieldUiSchema = uiSchema[field];
    if (!fieldUiSchema) {
      uiSchema[field] = appendVal;
    } else if (typeof appendVal === "object" && !Array.isArray(appendVal)) {
      doOverride(fieldUiSchema, appendVal);
    } else {
      uiSchema[field] = appendVal;
    }
  });
}

export default function uiOverride(params, schema, uiSchema) {
  doOverride(uiSchema, params);
}

if (isDevelopment()) {
  uiOverride.propTypes = PropTypes.object.isRequired;
  uiOverride.validate = validateFields("uiOverride", params =>
    Object.keys(params)
  );
}
