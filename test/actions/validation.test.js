import validate, {
  listAllActions,
  listInvalidActions,
} from "../../src/actions/validation";

test("empty", () => {
  let emptyRules = {};

  expect(listAllActions(emptyRules)).toEqual(new Set([]));
  expect(listInvalidActions(emptyRules, {})).toEqual([]);
  expect(validate(emptyRules, {})).toBeUndefined();
});

test("rules with no actions", () => {
  let invalidRules = {
    password: {
      where: {},
    },
  };

  expect(() => validate(invalidRules, {})).toThrow();
});

test("rules with invalid actions", () => {
  let invalidRules = {
    password: {
      where: {},
      action: "swim",
    },
  };

  expect(listAllActions(invalidRules)).toEqual(new Set(["swim"]));
  expect(listInvalidActions(invalidRules, {})).toEqual(["swim"]);

  expect(() => validate(invalidRules, {})).toThrow();
});

test("extracts all actions", () => {
  let rules = {
    password: {
      when: { firstName: "empty" },
      action: "remove",
    },
    telephone: [
      {
        when: { age: { greater: 10 } },
        action: "require",
      },
      {
        when: { age: { less: 20 } },
        action: "hide",
      },
    ],
  };

  let expected = new Set(["remove", "require", "hide"]);
  expect(listAllActions(rules)).toEqual(expected);
});
