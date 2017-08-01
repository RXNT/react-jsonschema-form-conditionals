import { findRelUiSchema, isDevelopment, validateFields } from "../utils";
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
function doAppend(agg, fieldSchema) {
  Object.keys(fieldSchema).forEach(key => {
    let val = fieldSchema[key];
    let aggVal = agg[key];
    if (!aggVal) {
      agg[key] = val;
    } else if (Array.isArray(aggVal)) {
      val.filter(v => !aggVal.includes(v)).forEach(v => aggVal.push(v));
    } else if (typeof val === "object") {
      doAppend(aggVal, val);
    } else if (typeof aggVal === "string") {
      if (!aggVal.includes(val)) {
        agg[key] = aggVal + " " + val;
      }
    } else {
      agg[key] = val;
    }
  });
  return agg;
}

export default function uiAppend(params, schema, uiSchema) {
  Object.keys(params).forEach(field => {
    doAppend(findRelUiSchema(field, uiSchema), params[field]);
  });
}

if (isDevelopment()) {
  uiAppend.propTypes = PropTypes.object.isRequired;
  uiAppend.validate = validateFields("uiAppend", params => Object.keys(params));
}
