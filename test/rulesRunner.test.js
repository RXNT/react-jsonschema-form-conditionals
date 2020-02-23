import rulesRunner from "../src/rulesRunner";
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

  let runRules = rulesRunner(SCHEMA, {}, rules, Engine);

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

  let runRules = rulesRunner(SCHEMA, {}, rules, Engine);

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

  let runRules = rulesRunner(SCHEMA, {}, rules, Engine);

  return Promise.all([
    runRules(undefined),
    runRules(null),
  ]).then(([withUndef, withNull]) => {
    expect(withNull).toEqual({ schema: SCHEMA, uiSchema: {}, formData: null });
    expect(withUndef).toEqual({
      schema: SCHEMA,
      uiSchema: {},
      formData: undefined,
    });
  });
});
