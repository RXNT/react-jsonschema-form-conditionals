const assert = require("assert");
const { expect } = require("chai")
const { toPredicateList, toFieldList } = require("../../src/Utils");

describe("List predicates and fields", function () {

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

    let fields = toFieldList(rules);
    expect(fields).eql(new Set(["password", "age", "telephone", "firstName"]));
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

    let fields = toFieldList(rules);
    expect(fields).eql(new Set(["password", "age", "telephone", "firstName", "lastName"]));
  })

});
