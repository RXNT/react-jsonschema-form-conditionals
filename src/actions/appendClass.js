import {
  isDevelopment,
  validateFields,
  toArray,
  findRelUiSchema,
} from "../utils";
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
  let fieldUiSchema = findRelUiSchema(field, uiSchema);
  if (fieldUiSchema.classNames) {
    if (fieldUiSchema.classNames.indexOf(classNames) === -1) {
      fieldUiSchema.classNames = `${fieldUiSchema.classNames} ${classNames}`;
    }
  } else {
    fieldUiSchema.classNames = classNames;
  }
}

export default function appendClass({ field, classNames }, schema, uiSchema) {
  toArray(field).forEach(f => doAppend(f, classNames, uiSchema));
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
