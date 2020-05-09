import React from "react";
import Form from "@rjsf/core";
import Engine from "json-rules-engine-simplified";
import applyRules from "../src";
import sinon from "sinon";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";
import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";

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
  let ResForm = applyRules(schema, {}, RULES, Engine)(Form);
  const handleChangeSpy = sinon.spy(ResForm.prototype, "handleChange");
  const updateConfSpy = sinon.spy(ResForm.prototype, "updateConf");
  const setStateSpy = sinon.spy(ResForm.prototype, "setState");

  const { rerender } = render(<ResForm formData={{ firstName: "A" }} />);

  expect(updateConfSpy.callCount).toEqual(1);
  await waitFor(() => expect(setStateSpy.callCount).toEqual(1));
  expect(handleChangeSpy.notCalled).toEqual(true);

  rerender(<ResForm formData={{ firstName: "A" }} />);
  expect(updateConfSpy.callCount).toEqual(1);
  expect(setStateSpy.callCount).toEqual(1);
  expect(handleChangeSpy.notCalled).toEqual(true);
});

test("Re render on formData change", async () => {
  let ResForm = applyRules(schema, {}, RULES, Engine)(Form);
  const handleChangeSpy = sinon.spy(ResForm.prototype, "handleChange");
  const updateConfSpy = sinon.spy(ResForm.prototype, "updateConf");
  const setStateSpy = sinon.spy(ResForm.prototype, "setState");

  const { rerender } = render(<ResForm formData={{ firstName: "A" }} />);

  expect(updateConfSpy.calledOnce).toEqual(true);
  await waitFor(() => expect(setStateSpy.callCount).toEqual(1));
  expect(handleChangeSpy.notCalled).toEqual(true);

  rerender(<ResForm formData={{ firstName: "An" }} />);
  expect(updateConfSpy.callCount).toEqual(2);
  await waitFor(() => expect(setStateSpy.callCount).toEqual(2));
  expect(handleChangeSpy.notCalled).toEqual(true);
});

test("Re render on non formData change change", () => {
  let ResForm = applyRules(schema, {}, RULES, Engine)(Form);
  const spy = sinon.spy(ResForm.prototype, "render");
  const wrapper = shallow(<ResForm formData={{ firstName: "A" }} some="A" />);

  wrapper.setProps({ formData: { firstName: "A" }, some: "B" });
  expect(spy.calledTwice).toEqual(true);
});
