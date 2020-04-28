import React from "react";
import Form from "@rjsf/core";
import Engine from "json-rules-engine-simplified";
import applyRules from "../src";
import sinon from "sinon";
import Adapter from "enzyme-adapter-react-16";
import { mount, configure } from "enzyme";

configure({ adapter: new Adapter() });

const schema = {
  type: "object",
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

test("Re render on rule change", () => {
  let ResForm = applyRules(schema, {}, RULES, Engine)(Form);

  const renderSpy = sinon.spy(ResForm.prototype, "render");
  const shouldComponentUpdateSpy = sinon.spy(
    ResForm.prototype,
    "shouldComponentUpdate"
  );
  const handleChangeSpy = sinon.spy(ResForm.prototype, "handleChange");
  const updateConfSpy = sinon.spy(ResForm.prototype, "updateConf");
  const setStateSpy = sinon.spy(ResForm.prototype, "setState");

  const wrapper = mount(<ResForm formData={{ firstName: "A" }} />);

  expect(renderSpy.calledOnce).toEqual(true);
  expect(updateConfSpy.calledOnce).toEqual(true);
  expect(handleChangeSpy.notCalled).toEqual(true);
  expect(setStateSpy.notCalled).toEqual(true);
  wrapper
    .find("#root_firstName")
    .find("input")
    .simulate("change", { target: { value: "" } });
  expect(renderSpy.calledOnce).toEqual(true);

  return new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
    expect(handleChangeSpy.calledOnce).toEqual(true);
    expect(setStateSpy.callCount).toEqual(1);
    expect(shouldComponentUpdateSpy.calledOnce).toEqual(true);

    expect(updateConfSpy.calledTwice).toEqual(true);
    expect(renderSpy.calledTwice).toEqual(true);
  });
});

test("onChange called with corrected schema", () => {
  let ResForm = applyRules(schema, {}, RULES, Engine)(Form);
  const changed = sinon.spy(() => {});
  const wrapper = mount(
    <ResForm formData={{ firstName: "A" }} onChange={changed} />
  );

  wrapper
    .find("#root_firstName")
    .find("input")
    .simulate("change", { target: { value: "" } });

  return new Promise((resolve) => setTimeout(resolve, 500)).then(() => {
    const expSchema = {
      type: "object",
      properties: {
        firstName: { type: "string" },
      },
    };

    expect(changed.calledOnce).toEqual(true);
    expect(changed.getCall(0).args[0].schema).toEqual(expSchema);
  });
});
