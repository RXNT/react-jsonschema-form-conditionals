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

export function conditionsMeet(rule, formData) {
  if (!isObject(rule) || !isObject(formData)) {
    toError(`Rule ${rule} with ${formData} can't be processed`);
  }
  return Object.keys(rule).every(ref => {
    if (ref === "or") {
      return rule[ref].some(subRule => conditionsMeet(subRule, formData));
    } else if (ref === "and") {
      return rule[ref].every(subRule => conditionsMeet(subRule, formData));
    } else {
      let refVal = formData[ref];
      let refFieldRule = rule[ref];
      return checkField(refVal, refFieldRule);
    }
  });
}

export default function applicableActions(rules, formData) {
  return flatMap(rules, ({ conditions, event }) => {
    if (conditionsMeet(conditions, formData)) {
      return [event];
    } else {
      return [];
    }
  });
}
