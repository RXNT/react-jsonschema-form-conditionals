import validate from "../../src/actions/validation";
import toAction from "../../src/actions";

test("empty", () => {
  let emptyRules = {};

  expect(validate(emptyRules, {})).toBeUndefined();
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
