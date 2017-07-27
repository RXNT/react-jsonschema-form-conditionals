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
function doAppend(field, classNames, uiSchema) {
  if (!uiSchema[field]) {
    uiSchema[field] = {};
  }
  if (uiSchema[field].classNames) {
    if (uiSchema[field].classNames.indexOf(classNames) === -1) {
      uiSchema[field].classNames = `${uiSchema[field]
        .classNames} ${classNames}`;
    }
  } else {
    uiSchema[field].classNames = classNames;
  }
}

export default function appendClass({ field, classNames }, schema, uiSchema) {
  if (Array.isArray(field)) {
    field.forEach(f => doAppend(f, classNames, uiSchema));
  } else {
    doAppend(field, classNames, uiSchema);
  }
}

if (isDevelopment()) {
  appendClass.propTypes = {
    field: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
    classNames: PropTypes.string.isRequired,
  };

  appendClass.validate = validateFields("appendClass");
}
