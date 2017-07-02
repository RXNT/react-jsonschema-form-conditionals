import RuleEngine from "../../src/engine/engine";
import { testInProd } from "../utils";

let invalidRules = [
  {
    conditions: {
      age: {
        and: {
          greater: 5,
          less: 70,
        },
      },
    },
    event: {
      type: "remove",
      params: {
        fields: ["telephone"],
      },
    },
  },
];

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
