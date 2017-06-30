import RuleEngine from "../../src/engine/engine";
import { testInProd } from "../utils.test";

let invalidRules = {
  telephone: {
    action: "remove",
    when: {
      age: {
        and: {
          greater: 5,
          less: 70,
        },
      },
    },
  },
};

let schema = {
  properties: {
    age: { type: "number" },
    telephone: { type: "string" },
  },
};

test("initialize with invalid rules", () => {
  expect(() => new RuleEngine(invalidRules, schema, {})).toThrow();
  expect(
    testInProd(() => new RuleEngine(invalidRules, schema, {}))
  ).not.toBeUndefined();
});
