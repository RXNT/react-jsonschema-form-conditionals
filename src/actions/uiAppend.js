import { findRelUiSchema, isDevelopment, validateFields } from "../utils";
import PropTypes from "prop-types";

/**
 * Merge original field in uiSchema with external configuration
 *
 * @param field
 * @param schema
 * @param uiSchema
 * @param conf
 * @returns {{schema: *, uiSchema: *}}
 */
function doAppend(target, fieldSchema) {
  Object.keys(fieldSchema).map(prop => {
    let val = fieldSchema[prop];
    if (target[prop]) {
      if (target[prop].indexOf(val) === -1) {
        target[prop] = `${target[prop]}${fieldSchema[prop]}`;
      }
    } else {
      target[prop] = val;
    }
  });
}

export default function uiAppend(params, schema, uiSchema) {
  Object.keys(params).forEach(field => {
    doAppend(params[field], findRelUiSchema(field, uiSchema));
  });
}

if (isDevelopment()) {
  uiAppend.propTypes = PropTypes.object.isRequired;
  uiAppend.validate = validateFields("uiAppend");
}
