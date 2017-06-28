const { expect } = require("chai");
const { listInvalidPredicates } = require("../../src/engine/validation");

describe("Check predicates", function () {

  it("finds invalid predicate", function () {
    const rules = {
      password: { when: { firstName: "epty" }, },
      telephone: [
        { when: { age: { greater: 10 } } },
        { when: { age: { less: 20 } } }
      ]
    };

    let predicates = listInvalidPredicates(rules);
    expect(predicates).eql(["epty"]);
  });

});