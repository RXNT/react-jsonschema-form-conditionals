import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Engine from "json-rules-engine-simplified";
import React from "react";
import sinon from "sinon";
import applyRules from "../src";
import FormWithConditionals from "../src/FormWithConditionals";
import { tick } from "./utils";

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

test("NO re render on same data", async () => {
  let ResForm = applyRules(schema, {}, RULES, Engine)();
  const renderSpy = sinon.spy(FormWithConditionals.prototype, "render");
  const wrapper = mount(<ResForm formData={{ firstName: "A" }} />);
  await tick();

  expect(renderSpy.calledOnce).toEqual(true);

  wrapper.setProps({ formData: { firstName: "A" } });

  await tick(1000);
  console.log(renderSpy.callCount);
  expect(renderSpy.calledOnce).toEqual(true);
  renderSpy.restore();
});

test("Re render on formData change", async () => {
  let ResForm = applyRules(schema, {}, RULES, Engine)();
  const renderSpy = sinon.spy(FormWithConditionals.prototype, "render");
  const wrapper = mount(<ResForm formData={{ firstName: "A" }} />);

  await tick();
  wrapper.setProps({ formData: { firstName: "An" } });

  await tick();
  expect(renderSpy.calledTwice).toEqual(true);
  renderSpy.restore();
});

test("Re render on non formData change change", () => {
  let ResForm = applyRules(schema, {}, RULES, Engine)();
  const spy = sinon.spy(FormWithConditionals.prototype, "render");
  const wrapper = mount(<ResForm formData={{ firstName: "A" }} some="A" />);

  wrapper.setProps({ formData: { firstName: "A" }, some: "B" });
  expect(spy.calledTwice).toEqual(true);
  spy.restore();
});
