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

const concat = (x, y) => x.concat(y);
const flatMap = (xs, f) => xs.map(f).reduce(concat, []);

function predicatesFromRule(rule) {
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

function predicatesFromWhen(when) {
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

function fieldsFromWhen(when) {
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

export function listAllActions(rules = {}) {
  let allActions = rulesIterator(rules).map((rule) => rule.action);
  return new Set(allActions);
}

function rulesIterator(rules = {}) {
  return flatMap(Object.keys(rules), (field) => {
    let fieldRule = rules[field];
    if (Array.isArray(fieldRule)) {
      return fieldRule;
    } else {
      return [fieldRule];
    }
  });
}