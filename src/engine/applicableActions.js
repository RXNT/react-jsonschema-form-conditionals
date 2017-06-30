import predicate from "predicate";
import { isObject, toError, flatMap } from "../utils";

const POSITIVE_PREDICATE = predicate;
const NEGATIVE_PREDICATE = predicate.not;

export function checkField(
  fieldVal,
  rule,
  predicator = predicate,
  condition = Array.prototype.every
) {
  if (isObject(rule)) {
    // Complicated rule - like { greater then 10 }
    return condition.call(Object.keys(rule), p => {
      let comparable = rule[p];
      if (isObject(comparable) || p === "not") {
        if (p === "or") {
          return comparable.some(condition =>
            checkField(fieldVal, condition, predicator, Array.prototype.every)
          );
        } else if (p === "not") {
          let oppositePredicator =
            predicator === NEGATIVE_PREDICATE
              ? POSITIVE_PREDICATE
              : NEGATIVE_PREDICATE;
          return checkField(
            fieldVal,
            comparable,
            oppositePredicator,
            Array.prototype.every
          );
        } else {
          return false;
        }
      } else {
        return predicator[p](fieldVal, comparable);
      }
    });
  } else {
    // Simple rule - like emptyString
    return predicator[rule](fieldVal);
  }
}

export function applyWhen(rule, formData) {
  if (!isObject(rule) || !isObject(formData)) {
    toError(`Rule ${rule} with ${formData} can't be processed`);
  }
  return Object.keys(rule).every(ref => {
    if (ref === "or") {
      return rule[ref].some(subRule => applyWhen(subRule, formData));
    } else if (ref === "and") {
      return rule[ref].every(subRule => applyWhen(subRule, formData));
    } else {
      let refVal = formData[ref];
      let refFieldRule = rule[ref];
      return checkField(refVal, refFieldRule);
    }
  });
}

export function fieldToActions(fieldRules, formData) {
  if (Array.isArray(fieldRules)) {
    return flatMap(fieldRules, r => fieldToActions(r, formData));
  } else {
    if (applyWhen(fieldRules.when, formData)) {
      let { action, conf } = fieldRules;
      return [{ action, conf }];
    } else {
      return [];
    }
  }
}

export default function applicableActions(rules, formData) {
  let agg = {};
  Object.keys(rules).forEach(field => {
    let fieldRules = rules[field];
    let actions = fieldToActions(fieldRules, formData);
    if (actions.length !== 0) {
      agg[field] = actions;
    }
  });
  return agg;
}
