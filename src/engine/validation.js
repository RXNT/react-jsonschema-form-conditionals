import predicate from "predicate";
import { flatMap, isObject, rulesIterator, toError } from "../utils/Utils";

export function predicatesFromRule(rule) {
  if (isObject(rule)) {
    return flatMap(Object.keys(rule), (p) => {
      let comparable = rule[p];
      if (isObject(comparable) || p === "not") {
        if (p === "or") {
          if (Array.isArray(comparable)) {
            return flatMap(comparable, condition => predicatesFromRule(condition));
          } else {
            return toError(`OR must be an array`);
          }
        } else {
          return predicatesFromRule(comparable);
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
  return flatMap(
    Object.keys(when),
    (ref) => {
      if (ref === "or" || ref === "and") {
        return flatMap(when[ref], w => predicatesFromRule(w));
      } else {
        return predicatesFromRule(when[ref]);
      }
    });
}

export function listAllPredicates(rules = {}) {
  let allPredicates = flatMap(
    rulesIterator(rules),
    (rule) => predicatesFromWhen(rule.when, allPredicates)
  );
  return new Set(allPredicates);
}

export function listInvalidPredicates(rules = {}) {
  let rulePredicates = listAllPredicates(rules);
  Object.keys(predicate).forEach((p) => rulePredicates.delete(p));
  return Array.from(rulePredicates);
}

export function fieldsFromWhen(when) {
  return flatMap(Object.keys(when), (ref) => {
    if (ref === "or" || ref === "and") {
      return flatMap(when[ref], (w) => fieldsFromWhen(w));
    } else {
      return [ref];
    }
  });
}

export function listAllFields(rules = {}) {
  let allFields = flatMap(rulesIterator(rules), rule => fieldsFromWhen(rule.when, allFields));
  return new Set(allFields.concat(Object.keys(rules)));
}

export function listInvalidFields(rules, schema) {
  let ruleFields = listAllFields(rules);
  Object.keys(schema.properties).forEach((f) => ruleFields.delete(f));
  return Array.from(ruleFields);
}

export function validate(rules, schema) {
  let invalidPredicates = listInvalidPredicates(rules);
  if (invalidPredicates.length !== 0) {
    toError(`Rule contains invalid predicates ${invalidPredicates}`);
  }

  let invalidFields = listInvalidFields(rules, schema);
  if (invalidFields.length !== 0) {
    toError(`Rule contains invalid fields ${invalidFields}`);
  }

  let whenMissing = rulesIterator(rules).filter(({ when }) => when === undefined);
  if (whenMissing.length !== 0) {
    toError(`Rule when is missing in ${JSON.stringify(whenMissing)}`);
  }
}