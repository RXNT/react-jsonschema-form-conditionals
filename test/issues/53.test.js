import Engine from "json-rules-engine-simplified";

import rulesRunner from "../../src/rulesRunner";

const rules = [
  {
    event: { type: "remove", params: { field: "two" } },
    conditions: { not: { one: { equal: true } } },
  },
];

const schema = {
  type: "object",
  required: ["one", "two", "three", "four"],
  properties: {
    one: { type: "boolean", title: "1. Should we show (2)?" },
    two: { type: "string", title: "2. Only shown if (1) is true" },
    three: { type: "string", title: "3. Always shown and required" },
    four: { type: "string", title: "4. Always shown and required" },
  },
};

const runRules = rulesRunner(schema, {}, rules, Engine);

test("remove only single field", () => {
  return runRules({ one: false }).then(({ schema }) => {
    expect(schema.required).toEqual(["one", "three", "four"]);
  });
});

test("keeps original required", () => {
  return runRules({ one: true }).then(({ schema }) => {
    expect(schema.required).toEqual(["one", "two", "three", "four"]);
  });
});
