import { isDevelopment, toError, findRelSchema } from "../src/utils";

import { testInProd } from "./utils";

test("isProduction", () => {
  expect(isDevelopment()).toBeTruthy();
  expect(testInProd(() => isDevelopment())).toBeFalsy();
});

test("error throws exception", () => {
  expect(() => toError("Yes")).toThrow();
  expect(testInProd(() => toError("Yes"))).toBeUndefined();
});

test("find rel schema with plain schema", () => {
  let schema = {
    properties: {
      lastName: { type: "string" },
      age: { type: "number" },
    },
  };
  expect(findRelSchema("lastName", schema)).toEqual(schema);
  expect(findRelSchema("age", schema)).toEqual(schema);
});

test("find rel schema with ref object schema", () => {
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
      address: {
        $ref: "#/definitions/address",
      },
    },
  };
  expect(findRelSchema("address", schema)).toEqual({
    properties: {
      street: { type: "string" },
      zip: { type: "string" },
    },
  });
  expect(findRelSchema("address.street", schema)).toEqual(
    schema.definitions.address
  );
});
