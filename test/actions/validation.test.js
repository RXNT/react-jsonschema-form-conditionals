import validate, {
  listAllActions,
  listInvalidActions,
} from "../../src/actions/validation";

test("empty", () => {
  let emptyRules = [];

  expect(listAllActions(emptyRules)).toEqual(new Set([]));
  expect(listInvalidActions(emptyRules, {})).toEqual([]);
  expect(validate(emptyRules, {})).toBeUndefined();
});

test("rules with invalid actions", () => {
  let invalidRules = [
    {
      conditions: {},
      event: {
        type: "swim",
      },
    },
  ];

  expect(listAllActions(invalidRules)).toEqual(new Set(["swim"]));
  expect(listInvalidActions(invalidRules, {})).toEqual(["swim"]);

  expect(() => validate(invalidRules, {})).toThrow();
});

test("extracts all actions", () => {
  let rules = [
    {
      conditions: { firstName: "empty" },
      event: { type: "remove" },
    },
    {
      conditions: { age: { greater: 10 } },
      event: { type: "require" },
    },
    {
      conditions: { age: { less: 20 } },
      event: { type: "hide" },
    },
  ];

  let expected = new Set(["remove", "require", "hide"]);
  expect(listAllActions(rules)).toEqual(expected);
});
