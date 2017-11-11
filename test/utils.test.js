import {
  findRelSchemaAndField,
  isDevelopment,
  toError,
  activeField,
} from "../src/utils";
import { testInProd } from "./utils";
import selectn from "selectn";

let addressSchema = {
  properties: {
    street: { type: "string" },
    zip: { type: "string" },
  },
};

let schema = {
  definitions: {
    address: addressSchema,
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
  expect(findRelSchemaAndField("lastName", schema)).toEqual({
    field: "lastName",
    schema,
  });
  expect(findRelSchemaAndField("age", schema)).toEqual({
    field: "age",
    schema,
  });
});

test("find rel schema with ref object schema", () => {
  expect(findRelSchemaAndField("someAddress", schema)).toEqual({
    field: "someAddress",
    schema,
  });
  expect(findRelSchemaAndField("someAddress.street", schema)).toEqual({
    field: "street",
    schema: addressSchema,
  });
});

test("find rel schema with ref array object schema", () => {
  let { definitions: { address } } = schema;
  expect(findRelSchemaAndField("houses", schema)).toEqual({
    field: "houses",
    schema,
  });
  expect(findRelSchemaAndField("houses.street", schema)).toEqual({
    field: "street",
    schema: address,
  });
});

test("fail to find rel schema", () => {
  expect(() => findRelSchemaAndField("email.host", schema)).toThrow();
  expect(
    testInProd(() => findRelSchemaAndField("email.host", schema))
  ).toEqual({ field: "email.host", schema });
});

test("fail to find rel schema field", () => {
  expect(() => findRelSchemaAndField("email.protocol", schema)).toThrow();
  expect(
    testInProd(() => findRelSchemaAndField("email.protocol", schema))
  ).toEqual({ field: "email.protocol", schema });
});

test("invalid field", () => {
  expect(() => findRelSchemaAndField("lastName.protocol", schema)).toThrow();
  expect(
    testInProd(() => findRelSchemaAndField("lastName.protocol", schema))
  ).toEqual({ field: "lastName.protocol", schema });
});

test("active field", () => {
  expect(activeField({ a: "A" }, { a: "B" })).toEqual("a");
  expect(
    activeField({ a: { b: "A", c: "A" } }, { a: { b: "B", c: "A" } })
  ).toEqual("a.b");
  expect(activeField({ a: { b: "A" } }, { a: { b: "A", c: "A" } })).toEqual(
    "a.c"
  );
  expect(activeField({}, { a: { b: "C" } })).toEqual("a.b");
  expect(activeField({ a: [{ b: "A" }] }, { a: [{ b: "C" }] })).toEqual(
    undefined
  );
  expect(activeField({}, { a: [{ b: "C" }] })).toEqual(undefined);
});

test("selectn", () => {
  expect(selectn("firstName", { firstName: {} })).toEqual({});
});
