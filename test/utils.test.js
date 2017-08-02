import { findRelSchema, isDevelopment, toError } from "../src/utils";
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
  expect(findRelSchema("houses", schema)).toEqual(schema.definitions.address);
  expect(findRelSchema("houses.street", schema)).toEqual(
    schema.definitions.address
  );
});
