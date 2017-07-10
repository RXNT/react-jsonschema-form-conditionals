import PropTypes from "prop-types";
import { toError } from "../utils";

export function listAllActions(rules) {
  let allActions = rules.map(({ event: { type } }) => type);
  return new Set(allActions);
}

export function listInvalidActions(rules, actions) {
  let ruleActions = listAllActions(rules);
  Object.keys(actions).forEach(a => ruleActions.delete(a));
  return Array.from(ruleActions);
}

function validateInvalidAction(rules, actions) {
  let invalidActions = listInvalidActions(rules, actions);
  if (invalidActions.length !== 0) {
    toError(`Rule contains invalid action "${invalidActions}"`);
  }
}

function validateInvalidParams(rules, actions, schema, uiSchema) {
  rules.map(({ event: { type, params } }) => {
    let actionPropTypes = actions[type].propTypes;
    if (actionPropTypes !== undefined && actionPropTypes !== null) {
      PropTypes.checkPropTypes(actionPropTypes, params, "prop", type);
    }

    let actionValidation = actions[type].validate;
    if (actionValidation && typeof actionValidation === "function") {
      actionValidation(params, schema, uiSchema);
    }
  });
}

export default function validate(rules, actions, schema, uiSchema) {
  validateInvalidAction(rules, actions);
  validateInvalidParams(rules, actions, schema, uiSchema);
}
