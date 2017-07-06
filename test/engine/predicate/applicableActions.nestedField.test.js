import applicableActions from "../../../src/engine/predicate/applicableActions";

let rules = [
  {
    conditions: {
      "address.line": "empty",
    },
    event: {
      type: "remove",
    },
  },
];

test("check nested fields work", function() {
  expect(applicableActions(rules, {})).toEqual([{ type: "remove" }]);
  expect(applicableActions(rules, { address: { line: "some" } })).toEqual([]);
});
