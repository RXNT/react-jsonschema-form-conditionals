import RuleEngine from "../../src/engine/engine";

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

test("age greater 5", () => {
  expect(() => new RuleEngine(invalidRules, schema, {})).toThrow();
});
