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

function predicatesFromRule(rule, agg = new Set()) {
  if (isObject(rule)) {
    Object.keys(rule).forEach((p) => {
      let comparable = rule[p];
      if (isObject(comparable) || p === "not") {
        if (p === "or") {
          if (Array.isArray(comparable)) {
            comparable.some(condition => predicatesFromRule(condition, agg));
          } else {
            return toError(`OR must be an array`);
          }
        } else {
          predicatesFromRule(comparable, agg);
        }
      } else {
        agg.add(p);
      }
    });
  } else {
    agg.add(rule);
  }
}

function predicatesFromWhen(when, agg = new Set()) {
  Object.keys(when).forEach(ref => {
    if (ref === "or" || ref === "and") {
      when[ref].forEach(w => predicatesFromRule(w, agg));
    } else {
      predicatesFromRule(when[ref], agg);
    }
  });
}

export function listAllPredicates(rules = {}) {
  let allPredicates = new Set([]);
  Object.keys(rules).forEach((field) => {
    let fieldRule = rules[field];
    if (Array.isArray(fieldRule)) {
      fieldRule.forEach(rule => predicatesFromWhen(rule.when, allPredicates));
    } else {
      predicatesFromWhen(fieldRule.when, allPredicates)
    }
  });
  return allPredicates;
}

function fieldsFromWhen(when, agg = new Set()) {
  Object.keys(when).forEach(ref => {
    if (ref === "or" || ref === "and") {
      when[ref].forEach((w) => fieldsFromWhen(w, agg));
    } else {
      agg.add(ref);
    }
  });
}

export function listAllFields(rules = {}) {
  let allFields = new Set();
  Object.keys(rules).forEach((field) => {
    allFields.add(field);
    let fieldRule = rules[field];
    if (Array.isArray(fieldRule)) {
      fieldRule.forEach(rule => fieldsFromWhen(rule.when, allFields));
    } else {
      fieldsFromWhen(fieldRule.when, allFields)
    }
  });
  return allFields;
}

export function listAllActions(rules = {}) {
  let allActions = new Set();
  Object.keys(rules).forEach(field => {
    let fieldRule = rules[field];
    if (Array.isArray(fieldRule)) {
      fieldRule.forEach(rule => allActions.add(rule.action));
    } else {
      allActions.add(fieldRule.action);
    }
  });
  return allActions;
}