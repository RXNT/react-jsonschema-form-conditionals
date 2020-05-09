import rulesRuner from "../src/rulesRunner";
import Engine from "json-rules-engine-simplified";

let SCHEMA = {
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    name: { type: "string" },
  },
};

test("executes single action", () => {
  let rules = [
    {
      conditions: { lastName: "empty" },
      event: {
        type: "remove",
        params: { field: "firstName" },
      },
    },
    {
      conditions: { lastName: "empty" },
      event: {
        type: "require",
        params: { field: "name" },
      },
    },
  ];

  let runRules = rulesRuner(SCHEMA, {}, rules, Engine);

  return runRules({}).then(({ schema }) => {
    let expectedSchema = {
      required: ["name"],
      properties: {
        lastName: schema.properties.lastName,
        name: schema.properties.name,
      },
    };
    expect(schema).toEqual(expectedSchema);
  });
});

test("executes multiple actions", () => {
  let rules = [
    {
      conditions: { lastName: "empty" },
      event: {
        type: "remove",
        params: { field: "firstName" },
      },
    },
    {
      conditions: { lastName: "empty" },
      event: {
        type: "require",
        params: { field: ["name"] },
      },
    },
    {
      conditions: { lastName: "empty" },
      event: {
        type: "uiReplace",
        params: { name: { classNames: "col-md-5" } },
      },
    },
  ];

  let runRules = rulesRuner(SCHEMA, {}, rules, Engine);

  return runRules({}).then(({ schema, uiSchema }) => {
    let expectedSchema = {
      required: ["name"],
      properties: {
        lastName: schema.properties.lastName,
        name: schema.properties.name,
      },
    };
    expect(schema).toEqual(expectedSchema);
    expect(uiSchema).toEqual({ name: { classNames: "col-md-5" } });
  });
});

test("ignored if no formData defined", () => {
  let rules = [
    {
      conditions: { lastName: "empty" },
      event: {
        type: "remove",
        params: { field: "firstName" },
      },
    },
    {
      conditions: { lastName: "empty" },
      event: {
        type: "require",
        params: { field: ["name"] },
      },
    },
    {
      conditions: { lastName: "empty" },
      event: {
        type: "uiReplace",
        params: { name: { classNames: "col-md-5" } },
      },
    },
  ];

  let runRules = rulesRuner(SCHEMA, {}, rules, Engine);

  return Promise.all([runRules(undefined), runRules(null)]).then(
    ([withUndef, withNull]) => {
      expect(withNull).toEqual({
        schema: SCHEMA,
        uiSchema: {},
        formData: null,
      });
      expect(withUndef).toEqual({
        schema: SCHEMA,
        uiSchema: {},
        formData: undefined,
      });
    }
  );
});

test("extra actions get evaluated", async () => {
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

  let runRules = rulesRuner(SCHEMA, {}, RULES, Engine, EXTRA_ACTIONS);

  const { formData } = await runRules({ a: 1, b: 2 });
  expect(formData.sum).toEqual(3);
});

test("remove part of schema", async () => {
  const SCHEMA = {
    type: "object",
    properties: {
      a: { type: "object" },
      b: { type: "object" },
    },
  };

  const RULES = [
    {
      conditions: { a: "empty" },
      event: {
        type: "remove",
        params: { field: "b" },
      },
    },
  ];

  let runRules = rulesRuner(SCHEMA, {}, RULES, Engine);

  const { schema } = await runRules({ a: {}, b: {} });
  expect(schema.properties).toStrictEqual({ a: { type: "object" } });
});
