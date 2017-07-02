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

export default function validate(rules, actions) {
  let invalidActions = listInvalidActions(rules, actions);
  if (invalidActions.length !== 0) {
    toError(`Rule contains invalid action "${invalidActions}"`);
  }
}
