import PropTypes from "prop-types";

export default function(action, params, schema, uiSchema) {
  if (action.propTypes !== undefined && action.propTypes !== null) {
    PropTypes.checkPropTypes(action.propTypes, params, "prop", action);
  }

  if (action.validate && typeof action.validate === "function") {
    action.validate(params, schema, uiSchema);
  }
}
