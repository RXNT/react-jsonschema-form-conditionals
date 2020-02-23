import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Engine from "json-rules-engine-simplified";
import React from "react";
import sinon from "sinon";
import FormWithConditionals from "../src/FormWithConditionals";
import { tick } from "./utils";

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

test("FormWithConditionals - Re render on rule change", async () => {
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

  const props = { schema, uiSchema: {}, rules: RULES, Engine };
  const wrapper = mount(
    <FormWithConditionals {...props} formData={{ firstName: "A" }} />
  );

  expect(renderSpy.calledOnce).toEqual(true);
  expect(updateConfSpy.calledOnce).toEqual(true);

  wrapper
    .find("#root_firstName")
    .find("input")
    .simulate("change", { target: { value: "" } });
  expect(renderSpy.calledOnce).toEqual(true);

  await tick();

  expect(handleChangeSpy.calledOnce).toEqual(true);
  expect(setStateSpy.calledOnce).toEqual(true);
  expect(shouldComponentUpdateSpy.calledOnce).toEqual(true);

  expect(updateConfSpy.calledTwice).toEqual(true);
  expect(renderSpy.calledTwice).toEqual(true);

  handleChangeSpy.restore();
  renderSpy.restore();
  setStateSpy.restore();
  shouldComponentUpdateSpy.restore();
  updateConfSpy.restore();
});

test("FormConditionals - onChange called with corrected schema", async () => {
  const changed = sinon.spy(() => {});
  const props = { schema, uiSchema: {}, rules: RULES, Engine };
  const wrapper = mount(
    <FormWithConditionals
      {...props}
      formData={{ firstName: "A" }}
      onChange={changed}
    />
  );

  wrapper
    .find("#root_firstName")
    .find("input")
    .simulate("change", { target: { value: "" } });

  await tick();

  expect(changed.called).toEqual(true);
  expect(changed.calledOnce).toEqual(true);
  expect(changed.getCall(0).args[0].schema).toEqual({
    type: "object",
    properties: {
      firstName: { type: "string" },
    },
  });
});

test("FormConditionals - state has corrected schema when formContext changes (and validation is disabled)", async () => {
  const RULES = [
    {
      conditions: {
        "formContext.foo.bar": { gt: 1 },
      },
      event: {
        type: "remove",
        params: {
          field: ["lastName", "name"],
        },
      },
    },
  ];
  const props = { schema, uiSchema: {}, rules: RULES, Engine };
  const formContext = { foo: { bar: 1 } };
  const wrapper = mount(
    <FormWithConditionals
      {...props}
      formData={{ firstName: "A", lastName: "B" }}
      formContext={formContext}
      validateSchema={false}
    />
  );

  wrapper.setProps({ formContext: { foo: { bar: 2 } } });

  await tick();

  const expSchema = {
    type: "object",
    properties: {
      firstName: { type: "string" },
    },
  };

  expect(wrapper.state("schema")).toEqual(expSchema);
});

test("FormConditionals - state has corrected schema when formContext changes (even when formContext starts empty)", async () => {
  const RULES = [
    {
      conditions: {
        "formContext.foo.bar": { gt: 1 },
      },
      event: {
        type: "remove",
        params: {
          field: ["lastName", "name"],
        },
      },
    },
  ];
  const props = { schema, uiSchema: {}, rules: RULES, Engine };
  const wrapper = mount(
    <FormWithConditionals
      {...props}
      formData={{ firstName: "A", lastName: "B" }}
      validateSchema={false}
    />
  );

  wrapper.setProps({ formContext: { foo: { bar: 2 } } });

  await tick();

  const expSchema = {
    type: "object",
    properties: {
      firstName: { type: "string" },
    },
  };

  expect(wrapper.state("schema")).toEqual(expSchema);
});
