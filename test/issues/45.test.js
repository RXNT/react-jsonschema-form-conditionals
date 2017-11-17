import React from "react";
import Form from "react-jsonschema-form";
import Engine from "json-rules-engine-simplified";
import applyRules from "../../src";
import sinon from "sinon";
import Adapter from "enzyme-adapter-react-16";
import { mount, configure } from "enzyme";

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

test("autofocus added only on relevant changes", () => {
  let ResForm = applyRules(
    schema,
    uiSchema,
    [
      {
        conditions: { firstName: { is: "An" } },
        event: { type: "remove", params: { field: "lastName" } },
      },
    ],
    Engine
  )(Form);

  const updateConfSpy = sinon.spy(ResForm.prototype, "updateConf");

  const wrapper = mount(<ResForm formData={{ firstName: "A" }} />);
  expect(updateConfSpy.calledOnce).toEqual(true);

  wrapper
    .find("#root_firstName")
    .find("input")
    .simulate("change", { target: { value: "An" } });

  return new Promise(resolve => setTimeout(resolve, 500))
    .then(() => {
      expect(updateConfSpy.calledTwice).toEqual(true);
      return updateConfSpy.returnValues[1];
    })
    .then(conf => {
      expect(conf.uiSchema.firstName).toEqual({ "ui:autofocus": true });
    });
});

test("autofocus ignored on irrelevant changes", () => {
  let ResForm = applyRules(schema, uiSchema, [], Engine)(Form);

  const updateConfSpy = sinon.spy(ResForm.prototype, "updateConf");

  const wrapper = mount(<ResForm formData={{ firstName: "A" }} />);
  expect(updateConfSpy.calledOnce).toEqual(true);

  wrapper
    .find("#root_firstName")
    .find("input")
    .simulate("change", { target: { value: "An" } });

  return new Promise(resolve => setTimeout(resolve, 500))
    .then(() => {
      expect(updateConfSpy.calledTwice).toEqual(true);
      return updateConfSpy.returnValues[1];
    })
    .then(conf => {
      expect(conf.uiSchema.firstName).toEqual({});
    });
});
