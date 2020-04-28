import { findRelSchemaAndField, toError } from "../src/utils";
import selectn from "selectn";
import envMock, { isDevelopmentMock } from "../src/env";
jest.mock("../src/env");

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
  expect(envMock.isDevelopment()).toBeTruthy();
  expect(isDevelopmentMock).toHaveBeenCalledTimes(1);
  isDevelopmentMock.mockReturnValueOnce(false);
  expect(envMock.isDevelopment()).toBeFalsy();
  expect(isDevelopmentMock).toHaveBeenCalledTimes(2);
});

test("error throws exception", () => {
  expect(() => toError("Yes")).toThrow();
  isDevelopmentMock.mockReturnValueOnce(false);
  expect(toError("Yes")).toBeUndefined();
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
  let {
    definitions: { address },
  } = schema;
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
  isDevelopmentMock.mockReturnValueOnce(false);
  expect(findRelSchemaAndField("email.host", schema)).toEqual({
    field: "email.host",
    schema,
  });
});

test("fail to find rel schema field", () => {
  expect(() => findRelSchemaAndField("email.protocol", schema)).toThrow();
  isDevelopmentMock.mockReturnValueOnce(false);
  expect(findRelSchemaAndField("email.protocol", schema)).toEqual({
    field: "email.protocol",
    schema,
  });
});

test("invalid field", () => {
  expect(() => findRelSchemaAndField("lastName.protocol", schema)).toThrow();
  isDevelopmentMock.mockReturnValueOnce(false);
  expect(findRelSchemaAndField("lastName.protocol", schema)).toEqual({
    field: "lastName.protocol",
    schema,
  });
});

test("selectn", () => {
  expect(selectn("firstName", { firstName: {} })).toEqual({});
});
