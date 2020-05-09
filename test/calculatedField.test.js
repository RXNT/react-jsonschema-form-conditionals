import React from "react";
import Form from "@rjsf/core";
import Engine from "json-rules-engine-simplified";
import applyRules from "../src";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { waitFor } from "@testing-library/dom";

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

test("extra action calculates field value", async () => {
  const ResForm = applyRules(SCHEMA, {}, RULES, Engine, EXTRA_ACTIONS)(Form);
  const { container } = render(<ResForm formData={{ a: 1, b: 2 }} />);
  const a = container.querySelector("[id='root_a']");
  const b = container.querySelector("[id='root_b']");
  const sum = container.querySelector("[id='root_sum']");
  expect(a.value).toBe("");
  expect(b.value).toBe("");
  expect(sum.value).toBe("");
  await waitFor(() => {
    expect(a.value).toBe("1");
    expect(b.value).toBe("2");
    expect(sum.value).toBe("3");
  });
});
