export function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}

export function isDevelopment() {
  return process.env.NODE_ENV !== "production";
}

export function toError(message) {
  if (isDevelopment()) {
    throw new ReferenceError(message);
  } else {
    console.error(message);
  }
}

const concat = (x, y) => x.concat(y);
export const flatMap = (xs, f) => xs.map(f).reduce(concat, []);

export function rulesIterator(rules = {}) {
  return flatMap(Object.keys(rules), field => {
    let fieldRule = rules[field];
    if (Array.isArray(fieldRule)) {
      return fieldRule;
    } else {
      return [fieldRule];
    }
  });
}
