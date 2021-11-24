import Form from "@rjsf/core";
import Engine from "json-rules-engine-simplified";
import applyRules from "../../src";

let schema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
  },
};

let uiSchema = {
  firstName: {},
  lastName: {},
};

let invalidNickName = [
  {
    conditions: { firstName: { is: "An" } },
    event: { type: "remove", params: { field: "nickName" } },
  },
];

test("validation happens on initial render", () => {
  expect(() =>
    applyRules(schema, uiSchema, invalidNickName, Engine)(Form)
  ).toThrow();
});

let invalidAction = [
  {
    conditions: { firstName: { is: "An" } },
    event: { type: "jump" },
  },
];

test("validation triggered on invalid action", () => {
  expect(() =>
    applyRules(schema, uiSchema, invalidAction, Engine)(Form)
  ).toThrow();
});
