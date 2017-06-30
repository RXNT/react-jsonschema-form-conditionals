import validate, {
  predicatesFromRule,
  predicatesFromWhen,
  listAllFields,
  listAllPredicates,
  listInvalidFields,
  listInvalidPredicates,
  listRulesWithoutWhen,
} from "../../src/engine/validation";
import { rulesIterator } from "../../src/utils";
import { testInProd } from "../utils.test";

test("Check predicates", () => {
  const rules = {
    password: { when: { firstName: "epty" } },
    telephone: [
      { when: { age: { greater: 10 } } },
      { when: { age: { less: 20 } } },
    ],
  };

  let predicates = listInvalidPredicates(rules);
  expect(predicates).toEqual(["epty"]);
});

test("Two field rule ", () => {
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
      {
        when: { age: { less: 20 } },
        action: "hide",
      },
    ],
  };

  let predicates = listAllPredicates(rules);
  expect(predicates).toEqual(new Set(["empty", "greater", "less"]));

  let fields = listAllFields(rules);
  expect(fields).toEqual(
    new Set(["firstName", "age", "password", "telephone"])
  );
});

test("3 field rule ", () => {
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
      { when: { age: { less: 20 } } },
    ],
    lastName: {
      when: { firstName: "empty" },
      action: "hide",
    },
  };

  let predicates = listAllPredicates(rules);
  expect(predicates).toEqual(new Set(["empty", "greater", "less"]));

  let fields = listAllFields(rules);
  expect(fields).toEqual(
    new Set(["firstName", "age", "password", "telephone", "lastName"])
  );
});

test("list all predicates", () => {
  let invalidRules = {
    telephone: {
      action: "remove",
      when: {
        age: {
          and: {
            greater: 5,
            less: 70,
          },
        },
      },
    },
  };

  expect(listAllPredicates(invalidRules)).toEqual(
    new Set(["greater", "less", "and"])
  );
});

let schema = {
  properties: {
    firstName: { type: "string" },
    password: { type: "string" },
  },
};

test("invalid field", () => {
  let invalidFieldRules = {
    password: {
      when: { lastName: "empty" },
      action: "remove",
    },
    nickName: {
      when: {
        or: [{ lastName: "empty" }, { firstName: "empty" }],
      },
    },
  };

  expect(listAllFields(invalidFieldRules)).toEqual(
    new Set(["lastName", "firstName", "password", "nickName"])
  );
  expect(listInvalidFields(invalidFieldRules, schema)).toEqual([
    "lastName",
    "nickName",
  ]);
  expect(() => validate(invalidFieldRules, schema)).toThrow();
});

test("invalid OR", () => {
  let invalidOrRules = {
    password: {
      when: {
        or: { firstName: "empty" },
      },
      action: "remove",
    },
  };

  expect(() => validate(invalidOrRules, schema)).toThrow();
});

test("invalid AND", () => {
  let invalidOrRules = {
    password: {
      when: {
        or: { firstName: "empty" },
      },
      action: "remove",
    },
  };

  expect(() => validate(invalidOrRules, schema)).toThrow();
});

test("when missing", () => {
  let noWhen = {
    password: [
      {
        when: {
          or: [{ firstName: "empty" }],
        },
        action: "remove",
      },
      {
        action: "remove",
      },
    ],
  };

  expect(rulesIterator(noWhen)).toEqual([
    noWhen.password[0],
    noWhen.password[1],
  ]);
  expect(listRulesWithoutWhen(noWhen)).toEqual([noWhen.password[1]]);
  expect(() => validate(noWhen, schema)).toThrow();
});

test("invalid field or", () => {
  let invalidFieldOr = {
    password: {
      when: {
        firstName: {
          or: {
            is: 10,
            some: 25,
          },
        },
      },
      action: "remove",
    },
  };

  expect(() =>
    predicatesFromRule(invalidFieldOr.password.when.firstName)
  ).toThrow();
  expect(
    testInProd(() => predicatesFromRule(invalidFieldOr.password.when.firstName))
  ).toEqual([]);
  expect(() => validate(invalidFieldOr, schema)).toThrow();
});

test("valid field or", () => {
  let validFieldOr = {
    password: {
      when: {
        firstName: {
          or: [{ is: 10 }, { is: 25 }],
        },
      },
      action: "remove",
    },
  };

  expect(predicatesFromWhen(validFieldOr.password.when)).toEqual(["is", "is"]);
  expect(validate(validFieldOr, schema)).toBeUndefined();
});

test("extract predicates from when with or & and", () => {
  expect(predicatesFromWhen({ or: [{ is: 1 }, { less: 10 }] })).toEqual([
    "is",
    "less",
  ]);
  expect(predicatesFromWhen({ and: [{ is: 1 }, { less: 10 }] })).toEqual([
    "is",
    "less",
  ]);
});
