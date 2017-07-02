import predicate from "predicate";
import { flatMap, isObject, toError } from "../utils";

export function predicatesFromRule(rule) {
  if (isObject(rule)) {
    return flatMap(Object.keys(rule), p => {
      let comparable = rule[p];
      if (isObject(comparable) || p === "not") {
        if (p === "or") {
          if (Array.isArray(comparable)) {
            return flatMap(comparable, condition =>
              predicatesFromRule(condition)
            );
          } else {
            toError(`OR must be an array`);
            return [];
          }
        } else {
          let predicates = predicatesFromRule(comparable);
          predicates.push(p);
          return predicates;
        }
      } else {
        return predicatesFromRule(p);
      }
    });
  } else {
    return [rule];
  }
}

export function predicatesFromWhen(when) {
  return flatMap(Object.keys(when), ref => {
    if (ref === "or" || ref === "and") {
      return flatMap(when[ref], w => predicatesFromRule(w));
    } else {
      return predicatesFromRule(when[ref]);
    }
  });
}

export function listAllPredicates(rules) {
  let allPredicates = flatMap(rules, rule =>
    predicatesFromWhen(rule.conditions)
  );
  return new Set(allPredicates);
}

export function listInvalidPredicates(rules) {
  let rulePredicates = listAllPredicates(rules);
  Object.keys(predicate).forEach(p => rulePredicates.delete(p));
  return Array.from(rulePredicates);
}

export function fieldsFromWhen(when) {
  return flatMap(Object.keys(when), ref => {
    if (ref === "or" || ref === "and") {
      return flatMap(when[ref], w => fieldsFromWhen(w));
    } else {
      return [ref];
    }
  });
}

export function listAllFields(rules) {
  let allFields = flatMap(rules, rule => fieldsFromWhen(rule.conditions));
  return new Set(allFields);
}

export function listInvalidFields(rules, schema) {
  let ruleFields = listAllFields(rules);
  Object.keys(schema.properties).forEach(f => ruleFields.delete(f));
  return Array.from(ruleFields);
}

export default function validate(rules, schema) {
  let invalidFields = listInvalidFields(rules, schema);
  if (invalidFields.length !== 0) {
    toError(`Rule contains invalid fields ${invalidFields}`);
  }

  let invalidPredicates = listInvalidPredicates(rules);
  if (invalidPredicates.length !== 0) {
    toError(`Rule contains invalid predicates ${invalidPredicates}`);
  }
}
