import React from "react";
import Form from "@rjsf/core";
import Engine from "json-rules-engine-simplified";
import applyRules from "../src";
import sinon from "sinon";
import Adapter from "enzyme-adapter-react-16";
import { mount, configure } from "enzyme";
import { fireEvent, render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";

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

test("Re render on rule change", async () => {
  let ResForm = applyRules(schema, {}, RULES, Engine)(Form);

  const handleChangeSpy = sinon.spy(ResForm.prototype, "handleChange");
  const updateConfSpy = sinon.spy(ResForm.prototype, "updateConf");
  const setStateSpy = sinon.spy(ResForm.prototype, "setState");

  const { container } = render(<ResForm formData={{ firstName: "A" }} />);

  expect(updateConfSpy.calledOnce).toEqual(true);
  await waitFor(() => {
    // componentDidMount called updateConfSpy which will update state
    expect(setStateSpy.callCount).toEqual(1);
  });
  expect(handleChangeSpy.notCalled).toEqual(true);

  const firstNameInput = container.querySelector("[id='root_firstName']");
  expect(firstNameInput).not.toBeNull();
  expect(firstNameInput.value).toEqual("A");

  fireEvent.change(firstNameInput, { target: { value: "" } });

  await waitFor(() => {
    expect(handleChangeSpy.callCount).toEqual(1);
  });
  expect(updateConfSpy.callCount).toEqual(2);
  await waitFor(() => {
    expect(setStateSpy.callCount).toEqual(2);
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
