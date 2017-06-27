const assert = require("assert");
const { expect } = require("chai")
const { toPredicateList } = require("../../src/Utils");

describe("List all predicates", function () {


  it("reads all predicates", function () {
    const rules = {
      password: { when: { firstName: "empty" }, },
      telephone: [
        { when: { age: { greater: 10 } } },
        { when: { age: { less: 20 } } }
      ]
    };

    let predicates = toPredicateList(rules);
    expect(predicates).eql(new Set(["empty", "greater", "less"]));
  });

  it("returns unique list", function () {
    const rules = {
      password: { when: { firstName: "empty" }, },
      telephone: [
        { when: { age: { greater: 10 } } },
        { when: { age: { less: 20 } } }
      ],
      lastName: { when: { firstName: "empty" } }
    };

    let predicates = toPredicateList(rules);
    expect(predicates).eql(new Set(["empty", "greater", "less"]));
  })

});
