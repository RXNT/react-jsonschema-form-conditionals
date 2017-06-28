import { rulesIterator, toError } from "../utils";

export function listAllActions(rules = {}) {
  let allActions = rulesIterator(rules).map((rule) => rule.action);
  return new Set(allActions);
}

export function listInvalidActions(rules = {}, actions = {}) {
  let ruleActions = this.listAllActions(rules);
  Object.keys(actions).forEach((a) => ruleActions.delete(a));
  return Array.from(ruleActions);
}

export function validate(rules, actions) {
  let actionMissing = rulesIterator(rules).filter(({ action }) => action === undefined);
  if (actionMissing.length !== 0) {
    toError(`Rule action is missing in ${JSON.stringify(actionMissing)}`);
  }

  let invalidActions = listInvalidActions(rules, actions);
  if (invalidActions.length !== 0) {
    toError(`Rule contains invalid action ${invalidActions}`);
  }
}
