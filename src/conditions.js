import predicate from "predicate";

const POSITIVE_PREDICATE = predicate;
const NEGATIVE_PREDICATE = predicate.not;

export function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}

export function check(
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
          if (Array.isArray(comparable)) {
            return comparable.some(condition =>
              check(fieldVal, condition, predicator, Array.prototype.every)
            );
          } else {
            return check(
              fieldVal,
              comparable,
              predicator,
              Array.prototype.some
            );
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

export function isRuleApplicable(
  rule,
  formData,
  condition = Array.prototype.every
) {
  if (!isObject(rule) || !isObject(formData)) {
    let message = `Rule ${rule} with ${formData} can't be processed`;
    if (process.env.NODE_ENV !== "production") {
      throw new ReferenceError(message);
    } else {
      console.error(message);
    }
    return false;
  }
  return condition.call(Object.keys(rule), ref => {
    if (ref === "or") {
      return isRuleApplicable(rule[ref], formData, Array.prototype.some);
    } else if (ref === "and") {
      return isRuleApplicable(rule[ref], formData, Array.prototype.every);
    } else {
      let refVal = formData[ref];
      let refFieldRule = rule[ref];
      return check(refVal, refFieldRule);
    }
  });
}

export const actionToFields = (rules = {}, formData = {}) => {
  let actions = Object.keys(rules).map(field => {
    let applicable = isRuleApplicable(rules[field], formData);
    return { [field]: applicable };
  });

  return Object.assign.apply(this, actions);
};
