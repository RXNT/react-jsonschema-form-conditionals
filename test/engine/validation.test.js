import validate, {
  listAllFields,
  listAllPredicates,
  listInvalidFields,
  listInvalidPredicates,
  predicatesFromRule,
  predicatesFromWhen,
} from "../../src/engine/validation";
import { testInProd } from "../utils";

test("Check predicates", () => {
  const rules = [
    { conditions: { firstName: "epty" } },
    { conditions: { age: { greater: 10 } } },
    { conditions: { age: { less: 20 } } },
  ];

  let predicates = listInvalidPredicates(rules);
  expect(predicates).toEqual(["epty"]);
});

test("Two field rule ", () => {
  const rules = [
    {
      conditions: { firstName: "empty" },
      event: { type: "remove" },
    },
    {
      conditions: { age: { greater: 10 } },
      event: { type: "require" },
    },
    {
      conditions: { age: { less: 20 } },
      event: { type: "hide" },
    },
  ];

  let predicates = listAllPredicates(rules);
  expect(predicates).toEqual(new Set(["empty", "greater", "less"]));

  let fields = listAllFields(rules);
  expect(fields).toEqual(new Set(["firstName", "age"]));
});

test("3 field rule ", () => {
  const rules = [
    {
      conditions: { firstName: "empty" },
      event: { type: "remove" },
    },
    {
      conditions: { age: { greater: 10 } },
      event: { type: "require" },
    },
    { conditions: { age: { less: 20 } } },
    {
      conditions: { firstName: "empty" },
      event: { type: "hide" },
    },
  ];

  let predicates = listAllPredicates(rules);
  expect(predicates).toEqual(new Set(["empty", "greater", "less"]));

  let fields = listAllFields(rules);
  expect(fields).toEqual(new Set(["firstName", "age"]));
});

test("list all predicates", () => {
  let invalidRules = [
    {
      event: { type: "remove" },
      conditions: {
        age: {
          and: {
            greater: 5,
            less: 70,
          },
        },
      },
    },
  ];

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
  let invalidFieldRules = [
    {
      conditions: { lastName: "empty" },
      event: {
        type: "remove",
      },
    },
    {
      conditions: {
        or: [{ lastName: "empty" }, { firstName: "empty" }],
      },
    },
  ];

  expect(listAllFields(invalidFieldRules)).toEqual(
    new Set(["lastName", "firstName"])
  );
  expect(listInvalidFields(invalidFieldRules, schema)).toEqual(["lastName"]);
  expect(() => validate(invalidFieldRules, schema)).toThrow();
});

test("invalid OR", () => {
  let invalidOrRules = [
    {
      conditions: {
        or: { firstName: "empty" },
      },
      event: { type: "remove" },
    },
  ];

  expect(() => validate(invalidOrRules, schema)).toThrow();
});

test("invalid AND", () => {
  let invalidOrRules = [
    {
      conditions: {
        or: { firstName: "empty" },
      },
      event: { type: "remove" },
    },
  ];

  expect(() => validate(invalidOrRules, schema)).toThrow();
});

test("invalid field or", () => {
  let invalidFieldOr = [
    {
      conditions: {
        firstName: {
          or: {
            is: 10,
            some: 25,
          },
        },
      },
      event: { type: "remove" },
    },
  ];

  expect(() =>
    predicatesFromRule(invalidFieldOr[0].conditions.firstName)
  ).toThrow();
  expect(
    testInProd(() => predicatesFromRule(invalidFieldOr[0].conditions.firstName))
  ).toEqual([]);
  expect(() => validate(invalidFieldOr, schema)).toThrow();
});

test("valid field or", () => {
  let validFieldOr = [
    {
      conditions: {
        firstName: {
          or: [{ is: 10 }, { is: 25 }],
        },
      },
      event: {
        type: "remove",
      },
    },
  ];

  expect(predicatesFromWhen(validFieldOr[0].conditions)).toEqual(["is", "is"]);
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
