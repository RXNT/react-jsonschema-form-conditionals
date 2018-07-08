import rulesRunner from "../../src/rulesRunner";
import Engine from "json-rules-engine-simplified";

test("rulesRunner with own Engine instantiation", () => {
  let rules = [
    {
      conditions: { name: { not: "empty" } },
      event: "foo",
    },
  ];

  rulesRunner(
    // schema
    { properties: { name: { type: "string" } } },
    // ui
    {},
    // rules
    rules,
    new Engine(rules)
  )({}).then(() => {});
});
