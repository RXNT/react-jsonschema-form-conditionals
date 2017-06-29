const { listInvalidPredicates } = require("../../src/engine/validation");

test("Check predicates", () => {
  const rules = {
    password: { when: { firstName: "epty" }, },
    telephone: [
      { when: { age: { greater: 10 } } },
      { when: { age: { less: 20 } } }
    ]
  };

  let predicates = listInvalidPredicates(rules);
  expect(predicates).toEqual(["epty"]);
});