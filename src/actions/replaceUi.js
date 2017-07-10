import { isDevelopment } from "../utils";
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
export default function replaceUi({ field, conf }, schema, uiSchema) {
  if (Array.isArray(field)) {
    field.forEach(f => {
      uiSchema[f] = conf;
    });
  } else {
    uiSchema[field] = conf;
  }
}

if (isDevelopment()) {
  replaceUi.propTypes = {
    field: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
    conf: PropTypes.object.isRequired,
  };
}
