import runRules from "../../src/runRules";
import rulesEngine from "json-rules-engine-simplified";

let schema = {
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    email: { type: "string" },
  },
};

let rules = [
  {
    conditions: {
      firstName: "empty",
    },
    event: [
      {
        type: "remove",
        params: { field: "email" },
      },
      {
        type: "uiAppend",
        params: { lastName: { classNames: "danger" } },
      },
    ],
  },
];

test("array works", () => {
  let expSchema = {
    properties: {
      firstName: { type: "string" },
      lastName: { type: "string" },
    },
  };
  let expUiSchema = {
    lastName: {
      classNames: "danger",
    },
  };
  return runRules(
    {},
    { rulesEngine, rules, schema }
  ).then(({ schema, uiSchema }) => {
    expect(schema).toEqual(expSchema);
    expect(uiSchema).toEqual(expUiSchema);
  });
});
