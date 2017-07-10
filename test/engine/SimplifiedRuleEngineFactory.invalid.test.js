import engineFactory from "../../src/engine/SimplifiedRuleEngineFactory";
// import { testInProd } from "../utils";

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
        field: ["telephone"],
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
  expect(() => engineFactory.getEngine(invalidRules, schema)).toThrow();
  // let engine = testInProd(() => engineFactory.getEngine(invalidRules, schema));
  // expect(engine).not.toBeUndefined();
});
