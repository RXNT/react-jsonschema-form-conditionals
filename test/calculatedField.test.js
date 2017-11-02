import React from "react";
import Form from "react-jsonschema-form";
import Engine from "json-rules-engine-simplified";
import applyRules from "../src";
import sinon from "sinon";
import Adapter from "enzyme-adapter-react-16";
import { mount, configure } from "enzyme";

configure({ adapter: new Adapter() });

const SCHEMA = {
  type: "object",
  properties: {
    a: { type: "number" },
    b: { type: "number" },
    sum: { type: "number" },
  },
};

const RULES = [
  {
    conditions: {
      a: { greater: 0 },
    },
    event: {
      type: "sum",
    },
  },
];

const EXTRA_ACTIONS = {
  sum: (params, schema, uiSchema, formData) => {
    formData.sum = formData.a + formData.b;
  },
};

test("formData has calculated field specified", () => {
  let ResForm = applyRules(SCHEMA, {}, RULES, Engine, EXTRA_ACTIONS)(Form);
  const renderSpy = sinon.spy(ResForm.prototype, "render");

  mount(<ResForm formData={{ a: 1, b: 2 }} />);
  expect(renderSpy.calledOnce).toEqual(true);

  return new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
    expect(renderSpy.calledTwice).toEqual(true);
  });
});
