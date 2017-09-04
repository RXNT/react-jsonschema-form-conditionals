import {
  findParentSchema,
  isDevelopment,
  toError,
  validateFields,
} from "../src/utils";
import { testInProd } from "./utils";

let schema = {
  definitions: {
    address: {
      properties: {
        street: { type: "string" },
        zip: { type: "string" },
      },
    },
  },
  properties: {
    lastName: { type: "string" },
    age: { type: "number" },
    someAddress: {
      $ref: "#/definitions/address",
    },
    houses: {
      type: "array",
      items: {
        $ref: "#/definitions/address",
      },
    },
    email: {
      $ref: "https://example.com/email.json",
    },
  },
};

test("isProduction", () => {
  expect(isDevelopment()).toBeTruthy();
  expect(testInProd(() => isDevelopment())).toBeFalsy();
});

test("error throws exception", () => {
  expect(() => toError("Yes")).toThrow();
  expect(testInProd(() => toError("Yes"))).toBeUndefined();
});

test("find rel schema with plain schema", () => {
  expect(findParentSchema("lastName", schema)).toEqual(schema);
  expect(findParentSchema("age", schema)).toEqual(schema);
});

test("find rel schema with ref object schema", () => {
  expect(findParentSchema("someAddress", schema)).toEqual(
    schema.definitions.address
  );
  expect(findParentSchema("someAddress.street", schema)).toEqual(
    schema.definitions.address
  );
});

test("find rel schema with ref array object schema", () => {
  let { definitions: { address } } = schema;
  expect(findParentSchema("houses", schema)).toEqual(address);
  expect(findParentSchema("houses.street", schema)).toEqual(address);
});

test("fail to find rel schema", () => {
  expect(() => findParentSchema("email", schema)).toThrow();
  expect(testInProd(() => findParentSchema("email", schema))).toBeUndefined();
});

test("fail to find rel schema field", () => {
  expect(() => findParentSchema("email.protocol", schema)).toThrow();
  expect(testInProd(() => findParentSchema("email.protocol", schema))).toEqual(
    schema
  );
});

test("invalid field", () => {
  expect(() => findParentSchema("lastName.protocol", schema)).toThrow();
  expect(
    testInProd(() => findParentSchema("lastName.protocol", schema))
  ).toEqual(schema);
});

test("validate field checks for a function", () => {
  expect(validateFields("fakeAction", [])).not.toBeUndefined();
  expect(validateFields("fakeAction", () => [])).not.toBeUndefined();
  expect(
    testInProd(() => validateFields("fakeAction", () => "a"))
  ).not.toBeUndefined();
  expect(() => validateFields("fakeAction")).toThrow();
  expect(() => validateFields("fakeAction", null)).toThrow();
  expect(
    testInProd(() => validateFields("fakeAction", undefined))
  ).toBeUndefined();
  expect(testInProd(() => validateFields("fakeAction"))).toBeUndefined();
  expect(testInProd(() => validateFields("fakeAction", null))).toBeUndefined();
  expect(
    testInProd(() => validateFields("fakeAction", undefined))
  ).toBeUndefined();
});
