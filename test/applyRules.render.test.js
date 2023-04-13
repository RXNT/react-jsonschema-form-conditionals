import React from "react";
import Form from "react-jsonschema-form";
import Engine from "json-rules-engine-simplified";
import applyRules from "../src";
import sinon from "sinon";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";

configure({ adapter: new Adapter() });

const schema = {
  type: "object",
  title: "Encounter",
  required: [],
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    name: { type: "string" },
  },
};

const RULES = [
  {
    conditions: {
      firstName: "empty",
    },
    event: {
      type: "remove",
      params: {
        field: ["lastName", "name"],
      },
    },
  },
];

test("NO re render on same data", () => {
  let ResForm = applyRules(schema, {}, RULES, Engine)(Form);
  const renderSpy = sinon.spy(ResForm.prototype, "render");
  const wrapper = shallow(<ResForm formData={{ firstName: "A" }} />);

  expect(renderSpy.calledOnce).toEqual(true);

  wrapper.setProps({ formData: { firstName: "A" } });
  expect(renderSpy.calledOnce).toEqual(true);
});

test("Re render on formData change", () => {
  let ResForm = applyRules(schema, {}, RULES, Engine)(Form);
  const renderSpy = sinon.spy(ResForm.prototype, "render");
  const wrapper = shallow(<ResForm formData={{ firstName: "A" }} />);

  return new Promise(resolve => setTimeout(resolve, 500))
    .then(() => {
      wrapper.setProps({ formData: { firstName: "An" } });
      return new Promise(resolve => setTimeout(resolve, 500));
    })
    .then(() => {
      expect(renderSpy.calledTwice).toEqual(true);
    });
});