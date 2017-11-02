import PropTypes from "prop-types";
import { toArray, toError } from "../utils";
import { extractRefSchema } from "json-rules-engine-simplified/lib/utils";

const hasField = (field, schema) => {
  let separator = field.indexOf(".");
  if (separator === -1) {
    return schema.properties[field] !== undefined;
  } else {
    let parentField = field.substr(0, separator);
    let refSchema = extractRefSchema(parentField, schema);
    return refSchema ? hasField(field.substr(separator + 1), refSchema) : false;
  }
};

export const validateFields = (action, fetchFields) => {
  if (!fetchFields) {
    toError("validateFields requires fetchFields function");
    return;
  }
  return (params, schema) => {
    let relFields = toArray(fetchFields(params));
    relFields
      .filter(field => !hasField(field, schema))
      .forEach(field =>
        toError(`Field "${field}" is missing from schema on "${action}"`)
      );
  };
};

export default function(action, params, schema, uiSchema) {
  if (action.propTypes !== undefined && action.propTypes !== null) {
    PropTypes.checkPropTypes(action.propTypes, params, "prop", action);
  }

  if (action.validate && typeof action.validate === "function") {
    action.validate(params, schema, uiSchema);
  }
}
