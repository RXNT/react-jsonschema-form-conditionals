export function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}

export function toError(message) {
  if (process.env.NODE_ENV !== "production") {
    throw new ReferenceError(message);
  } else {
    console.error(message);
  }
  return false;
}

function collectPredicatesFromRule(rule, agg = new Set()) {
  if (isObject(rule)) {
    Object.
      keys(rule).
      forEach((p) => {
        let comparable = rule[p];
        if (isObject(comparable) || p === "not") {
          if (p === "or") {
            if (Array.isArray(comparable)) {
              comparable.some(condition => collectPredicatesFromRule(condition, agg));
            } else {
              return toError(`OR must be an array`);
            }
          } else {
            collectPredicatesFromRule(comparable, agg);
          }
        } else {
          agg.add(p);
        }
      });
  } else {
    agg.add(rule);
  }
}

function collectPredicatesFromWhen(when, agg) {
  Object.keys(when).forEach(ref => {
    if (ref === "or") {
      collectPredicatesFromRule(when[ref], agg);
    } else if (ref === "and") {
      collectPredicatesFromRule(when[ref], agg);
    } else {
      collectPredicatesFromRule(when[ref], agg);
    }
  });
}

export function toPredicateList(rules = {}) {
  let allPredicates = new Set([]);
  Object.keys(rules).forEach((field) => {
    let fieldRule = rules[field];
    if (Array.isArray(fieldRule)) {
      fieldRule.forEach(rule => collectPredicatesFromWhen(rule.when, allPredicates));
    } else {
      collectPredicatesFromWhen(fieldRule.when, allPredicates)
    }
  });
  return allPredicates;
}