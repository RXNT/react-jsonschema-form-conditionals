const { expect } = require("chai");
const { listAllPredicates, listAllFields, listAllActions } = require("../../src/Utils");

describe("Two field rule ", function () {
  const rules = {
    password: {
      when: { firstName: "empty" },
      action: "remove"
    },
    telephone: [
      {
        when: { age: { greater: 10 } },
        action: "require"
      },
      {
        when: { age: { less: 20 } },
        action: "hide"
      }
    ]
  };

  it("reads all predicates", function () {
    let predicates = listAllPredicates(rules);
    expect(predicates).eql(new Set(["empty", "greater", "less"]));
  });

  it("reads all fields", function () {
    let fields = listAllFields(rules);
    expect(fields).eql(new Set(["password", "age", "telephone", "firstName"]));
  });

  it("reads all actions", function () {
    let actions = listAllActions(rules);
    let expected = new Set(["remove", "require", "hide"]);
    expect(actions).eql(expected);
  });
});

describe("3 field rule ", function () {

    const rules = {
      password: {
        when: { firstName: "empty" },
        action: "remove",
      },
      telephone: [
        {
          when: { age: { greater: 10 } },
          action: "require",
        },
        { when: { age: { less: 20 } } }
      ],
      lastName: {
        when: { firstName: "empty" },
        action: "hide",
      }
    };

  it("returns unique list of predicates", function () {
    let predicates = listAllPredicates(rules);
    expect(predicates).eql(new Set(["empty", "greater", "less"]));
  });

  it("returns unique list of fields", function () {
    let fields = listAllFields(rules);
    expect(fields).eql(new Set(["password", "age", "telephone", "firstName", "lastName"]));
  });

  it("returns unique list of actions", function () {
    let actions = listAllActions(rules);
    let expected = new Set(["remove", "require", "hide", undefined]);
    expect(actions).eql(expected);
  });

});
