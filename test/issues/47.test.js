import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Engine from "json-rules-engine-simplified";
import React from "react";
import applyRules from "../../src";

configure({ adapter: new Adapter() });

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
  expect(() => {
    const Form = applyRules(schema, uiSchema, invalidNickName, Engine)();
    mount(<Form />);
  }).toThrow();
});

let invalidAction = [
  {
    conditions: { firstName: { is: "An" } },
    event: { type: "jump" },
  },
];

test("validation triggered on invalid action", () => {
  expect(() => {
    const Form = applyRules(schema, uiSchema, invalidAction, Engine)();
    mount(<Form />);
  }).toThrow();
});
