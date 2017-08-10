import validateAction from "../../src/actions/validateAction";
import toAction from "../../src/actions";

test("empty", () => {
  let emptyRules = {};

  expect(validateAction(emptyRules, {})).toBeUndefined();
});

test("rules with invalid actions", () => {
  let invalidRule = {
    conditions: {},
    event: {
      type: "swim",
    },
  };

  expect(() => toAction(invalidRule)).toThrow();
});
