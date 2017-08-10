import {
  findRelSchema,
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
  expect(findRelSchema("lastName", schema)).toEqual(schema);
  expect(findRelSchema("age", schema)).toEqual(schema);
});

test("find rel schema with ref object schema", () => {
  expect(findRelSchema("someAddress", schema)).toEqual(
    schema.definitions.address
  );
  expect(findRelSchema("someAddress.street", schema)).toEqual(
    schema.definitions.address
  );
});

test("find rel schema with ref array object schema", () => {
  let { definitions: { address } } = schema;
  expect(findRelSchema("houses", schema)).toEqual(address);
  expect(findRelSchema("houses.street", schema)).toEqual(address);
});

test("fail to find rel schema", () => {
  expect(() => findRelSchema("email", schema)).toThrow();
  expect(testInProd(() => findRelSchema("email", schema))).toBeUndefined();
});

test("fail to find rel schema field", () => {
  expect(() => findRelSchema("email.protocol", schema)).toThrow();
  expect(testInProd(() => findRelSchema("email.protocol", schema))).toEqual(
    schema
  );
});

test("invalid field", () => {
  expect(() => findRelSchema("lastName.protocol", schema)).toThrow();
  expect(testInProd(() => findRelSchema("lastName.protocol", schema))).toEqual(
    schema
  );
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
