const assert = require("assert");
const { expect } = require("chai");
const { checkPredicates } = require("../../src/Conditionals");

describe("Check predicates", function () {

  it("finds invalid predicate", function () {
    const rules = {
      password: { when: { firstName: "epty" }, },
      telephone: [
        { when: { age: { greater: 10 } } },
        { when: { age: { less: 20 } } }
      ]
    };

    let predicates = checkPredicates(rules);
    expect(predicates).eql(["epty"]);
  });

});