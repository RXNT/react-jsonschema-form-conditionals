import { isDevelopment, validateFields, findRelUiSchema } from "../utils";
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
    let fieldUiSchema = findRelUiSchema(f, uiSchema);
    Object.keys(fieldUiSchema).forEach(key => delete fieldUiSchema[key]);
    Object.assign(fieldUiSchema, params[f]);
  });
}

if (isDevelopment()) {
  uiReplace.propTypes = PropTypes.object.isRequired;
  uiReplace.validate = validateFields("uiReplace", params =>
    Object.keys(params)
  );
}
