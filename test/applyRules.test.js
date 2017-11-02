import React from "react";
import Form from "react-jsonschema-form";
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
      field: ["lastName", "name"],
    },
  },
];

test("Re render on rule change", () => {
  let ResForm = applyRules(schema, {}, RULES, Engine)(Form);
  const spy = sinon.spy(ResForm.prototype, "render");
  const wrapper = mount(<ResForm formData={{ firstName: "A" }} />);

  expect(spy.calledOnce).toEqual(true);

  wrapper
    .find("#root_firstName")
    .find("input")
    .simulate("change", { target: { value: "" } });

  return new Promise(resolve => setTimeout(resolve, 500)).then(() => {
    expect(spy.calledTwice).toEqual(true);
  });
});

test("OnChange propagated", () => {
  let ResForm = applyRules(schema, {}, RULES, Engine)(Form);
  const changed = sinon.spy(() => {});
  const wrapper = mount(
    <ResForm formData={{ firstName: "A" }} onChange={changed} />
  );

  wrapper
    .find("#root_firstName")
    .find("input")
    .simulate("change", { target: { value: "" } });

  return new Promise(resolve => setTimeout(resolve, 500)).then(() => {
    expect(changed.calledOnce).toEqual(true);
  });
});
