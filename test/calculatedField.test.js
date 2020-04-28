import React from "react";
import Form from "@rjsf/core";
import Engine from "json-rules-engine-simplified";
import applyRules from "../src";
import sinon from "sinon";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import Adapter from "enzyme-adapter-react-16";
import { mount, configure } from "enzyme";
import { waitFor } from "@testing-library/dom";

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

test("formData has calculated field specified [enzyme]", () => {
  const ResForm = applyRules(SCHEMA, {}, RULES, Engine, EXTRA_ACTIONS)(Form);
  const renderSpy = sinon.spy(ResForm.prototype, "render");

  const wrapper = mount(<ResForm formData={{ a: 1, b: 2 }} />);
  const formComp = wrapper.find("Form");

  expect(renderSpy.calledOnce).toEqual(true);

  expect(formComp.state().formData.a).toEqual(1);
  expect(formComp.state().formData.b).toEqual(2);
  expect(formComp.state().formData.sum).toBeUndefined();

  return new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
    expect(formComp.state().formData.sum).toEqual(3);
    expect(renderSpy.callCount).toEqual(5);
  });
});

test("extra action calculates field value [testing library]", async () => {
  const ResForm = applyRules(SCHEMA, {}, RULES, Engine, EXTRA_ACTIONS)(Form);
  const { container } = render(<ResForm formData={{ a: 1, b: 2 }} />);
  const a = container.querySelector("[id='root_a']");
  const b = container.querySelector("[id='root_b']");
  const sum = container.querySelector("[id='root_sum']");
  expect(a.value).toBe("1");
  expect(b.value).toBe("2");
  await waitFor(() => expect(sum.value).toBe("3"));
});
