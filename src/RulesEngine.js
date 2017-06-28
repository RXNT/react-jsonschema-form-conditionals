import predicate from "predicate";
import { isObject, toError } from "./utils/Utils";
import validate from './engine/validation';

const POSITIVE_PREDICATE = predicate;
const NEGATIVE_PREDICATE = predicate.not;

export function check(fieldVal, rule, predicator = predicate, condition = Array.prototype.every) {
  if (isObject(rule)) {
    // Complicated rule - like { greater then 10 }
    return condition.call(Object.keys(rule), p => {
      let comparable = rule[p];
      if (isObject(comparable) || p === "not") {
        if (p === "or") {
          if (Array.isArray(comparable)) {
            return comparable.some(condition => check(fieldVal, condition, predicator, Array.prototype.every));
          } else {
            return toError(`OR must be an array`);
          }
        } else if (p === "not") {
          let oppositePredicator = predicator === NEGATIVE_PREDICATE
            ? POSITIVE_PREDICATE
            : NEGATIVE_PREDICATE;
          return check(
            fieldVal,
            comparable,
            oppositePredicator,
            Array.prototype.every
          );
        } else {
          return check(
            fieldVal,
            comparable,
            predicator[p],
            Array.prototype.every
          );
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

export function applyWhen(rule, formData, condition = Array.prototype.every) {
  if (!isObject(rule) || !isObject(formData)) {
    return toError(`Rule ${rule} with ${formData} can't be processed`);
  }
  return condition.call(Object.keys(rule), ref => {
    if (ref === "or") {
      return applyWhen(rule[ref], formData, Array.prototype.some);
    } else if (ref === "and") {
      return applyWhen(rule[ref], formData, Array.prototype.every);
    } else {
      let refVal = formData[ref];
      let refFieldRule = rule[ref];
      return check(refVal, refFieldRule);
    }
  });
}

export function fieldToActions(fieldRules, formData) {
  if (Array.isArray(fieldRules)) {
    let applicableRules = fieldRules.filter((rule) => applyWhen(rule.when, formData));
    let applicableActions = applicableRules.map(({ action, conf }) => {
      return { action, conf };
    });
    return applicableActions;
  } else {
    if (applyWhen(fieldRules.when, formData)) {
      let { action, conf } = fieldRules;
      return [{ action, conf }];
    } else {
      return [];
    }
  }
}

export function rulesToActions(rules = {}, formData = {}) {
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

export default class RulesEngine {
  constructor(rules, schema, uiSchema) {
    this.schema = schema;
    this.uiSchema = uiSchema;
    this.rules = rules;

    if (process.env.NODE_ENV !== "production") {
      validate(rules, schema);
    }
  }

  run = (formData) => {
    let self = this;
    return new Promise(function (resolve, reject) {
      try {
        resolve(rulesToActions(self.rules, formData));
      } catch (err) {
        reject(err);
      }
    });
  }

}