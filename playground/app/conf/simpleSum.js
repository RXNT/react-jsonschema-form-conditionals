import Engine from "json-rules-engine-simplified";

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

export default {
  schema: SCHEMA,
  uiSchema: {},
  rules: RULES,
  rulesEngine: Engine,
  formData: { a: 1, b: 2 },
  extraActions: EXTRA_ACTIONS,
};
