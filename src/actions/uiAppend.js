import { isDevelopment, toArray, validateFields } from "../utils";
import PropTypes from "prop-types";

/**
 * Append original field in uiSchema with external configuration
 *
 * @param field
 * @param schema
 * @param uiSchema
 * @param conf
 * @returns {{schema: *, uiSchema: *}}
 */
function doAppend(uiSchema, params) {
  Object.keys(params).forEach(field => {
    let appendVal = params[field];
    let fieldUiSchema = uiSchema[field];
    if (!fieldUiSchema) {
      uiSchema[field] = appendVal;
    } else if (Array.isArray(fieldUiSchema)) {
      toArray(appendVal)
        .filter(v => !fieldUiSchema.includes(v))
        .forEach(v => fieldUiSchema.push(v));
    } else if (typeof appendVal === "object" && !Array.isArray(appendVal)) {
      doAppend(fieldUiSchema, appendVal);
    } else if (typeof fieldUiSchema === "string") {
      if (!fieldUiSchema.includes(appendVal)) {
        uiSchema[field] = fieldUiSchema + " " + appendVal;
      }
    } else {
      uiSchema[field] = appendVal;
    }
  });
}

export default function uiAppend(params, schema, uiSchema) {
  doAppend(uiSchema, params);
}

if (isDevelopment()) {
  uiAppend.propTypes = PropTypes.object.isRequired;
  uiAppend.validate = validateFields("uiAppend", function(params) {
    return Object.keys(params);
  });
}
