import Engine from "json-rules-engine-simplified";

const conf = {
  formData: { a: 1, b: 2 },
  schema: {
    type: "object",
    properties: {
      a: { type: "number" },
      b: { type: "number" },
      sum: { type: "number" },
    },
  },
  uiSchema: {},
  rules: [
    {
      conditions: {
        a: "number",
        b: "number",
      },
      event: {
        type: "sum",
      },
    },
  ],
  extraActions: {
    sum: (params, schema, uiSchema, formData) => {
      formData.sum = formData.a + formData.b;
    },
  },
  rulesEngine: Engine,
};

export default conf;
