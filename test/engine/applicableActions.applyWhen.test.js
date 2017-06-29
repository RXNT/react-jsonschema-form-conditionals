const { applyWhen } = require("../../src/engine/applicableActions");

test("sanity check", function() {
  expect(() => applyWhen("empty", {})).toThrow();
  expect(() => applyWhen({}, 0)).toThrow();
});

test("single line", () => {
  let singleLine = {
    firstName: "empty",
  };
  expect(applyWhen(singleLine, {})).toBeTruthy();
  expect(applyWhen(singleLine, { firstName: "some" })).toBeFalsy();
  expect(applyWhen(singleLine, { firstName: "" })).toBeTruthy();
  expect(applyWhen(singleLine, { firstName: undefined })).toBeTruthy();
});

test("default use and", () => {
  let rule = {
    firstName: {
      equal: "Will",
    },
    lastName: {
      equal: "Smith",
    },
  };
  expect(applyWhen(rule, { firstName: "Will" })).toBeFalsy();
  expect(applyWhen(rule, { lastName: "Smith" })).toBeFalsy();
  expect(
    applyWhen(rule, { firstName: "Will", lastName: "Smith" })
  ).toBeTruthy();
});
