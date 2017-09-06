import validateAction from "../../src/actions/validateAction";
import execute from "../../src/actions";

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

  expect(() => execute(invalidRule.event)).toThrow();
});
