import PropTypes from "prop-types";
import { toError } from "../utils";

export default function validateAction(action, params, schema, uiSchema) {
  if (action.propTypes !== undefined && action.propTypes !== null) {
    PropTypes.checkPropTypes(action.propTypes, params, "prop", action);
  }

  if (action.validate && typeof action.validate === "function") {
    if (params === undefined || params === null) {
      toError(`For ${action} validation is present, but params are missing`);
    }
    action.validate(params, schema, uiSchema);
  }
}
