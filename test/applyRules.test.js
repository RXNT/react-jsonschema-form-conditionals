import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Engine from "json-rules-engine-simplified";
import React from "react";
import sinon from "sinon";
import applyRules from "../src";
import FormWithConditionals from "../src/FormWithConditionals";

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
  let ResForm = applyRules(schema, {}, RULES, Engine)();

  const renderSpy = sinon.spy(FormWithConditionals.prototype, "render");
  const shouldComponentUpdateSpy = sinon.spy(
    FormWithConditionals.prototype,
    "shouldComponentUpdate"
  );
  const handleChangeSpy = sinon.spy(
    FormWithConditionals.prototype,
    "handleChange"
  );
  const updateConfSpy = sinon.spy(FormWithConditionals.prototype, "updateConf");
  const setStateSpy = sinon.spy(FormWithConditionals.prototype, "setState");

  const wrapper = mount(<ResForm formData={{ firstName: "A" }} />);

  expect(renderSpy.calledOnce).toEqual(true);
  expect(updateConfSpy.calledOnce).toEqual(true);

  wrapper
    .find("#root_firstName")
    .find("input")
    .simulate("change", { target: { value: "" } });
  expect(renderSpy.calledOnce).toEqual(true);

  return new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
    expect(handleChangeSpy.calledOnce).toEqual(true);
    expect(setStateSpy.calledOnce).toEqual(true);
    expect(shouldComponentUpdateSpy.calledOnce).toEqual(true);

    expect(updateConfSpy.calledTwice).toEqual(true);
    expect(renderSpy.calledTwice).toEqual(true);
  });
});

test("onChange called with corrected schema", () => {
  let ResForm = applyRules(schema, {}, RULES, Engine)();
  const changed = sinon.spy(() => {});
  const wrapper = mount(
    <ResForm formData={{ firstName: "A" }} onChange={changed} />
  );

  wrapper
    .find("#root_firstName")
    .find("input")
    .simulate("change", { target: { value: "" } });

  return new Promise(resolve => setTimeout(resolve, 500)).then(() => {
    const expSchema = {
      type: "object",
      properties: {
        firstName: { type: "string" },
      },
    };

    expect(changed.called).toEqual(true);
    expect(changed.calledOnce).toEqual(true);
    expect(changed.getCall(0).args[0].schema).toEqual(expSchema);
  });
});
