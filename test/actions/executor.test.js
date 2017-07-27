import runRules from "../../src/runRules";
import rulesEngine from "../../src/engine/SimplifiedRuleEngineFactory";

let schema = {
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

  return runRules({}, { rules, schema, rulesEngine }).then(({ schema }) => {
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
        type: "replaceUi",
        params: { field: "name", conf: { classNames: "col-md-5" } },
      },
    },
  ];

  return runRules(
    {},
    { rules, schema, rulesEngine }
  ).then(({ schema, uiSchema }) => {
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
