import remove from "../../src/actions/remove";
import deepcopy from "deepcopy";
import { findRelSchemaAndField } from "../../src/utils";

let origSchemaWithRef = {
  definitions: {
    address: {
      properties: {
        street: { type: "string" },
        zip: { type: "string" },
      },
    },
  },
  properties: {
    title: { type: "string" },
    firstName: { type: "string" },
    address: { $ref: "#/definitions/address" },
  },
};

let originUiSchemaWithRef = {
  title: {},
  firstName: {},
  address: {},
};

test("remove field which contains ref", () => {
  let schemaWithRef = deepcopy(origSchemaWithRef);
  let uiSchemaWithRef = deepcopy(originUiSchemaWithRef);
  remove({ field: ["address"] }, schemaWithRef, uiSchemaWithRef);

  let schemaWithoutAddress = {
    definitions: {
      address: {
        properties: {
          street: { type: "string" },
          zip: { type: "string" },
        },
      },
    },
    properties: {
      title: { type: "string" },
      firstName: { type: "string" },
    },
  };

  expect(findRelSchemaAndField("address", origSchemaWithRef)).toEqual({
    field: "address",
    schema: origSchemaWithRef,
  });

  expect(schemaWithRef).toEqual(schemaWithoutAddress);

  let uiSchemaWithoutAddress = {
    title: {},
    firstName: {},
  };
  expect(uiSchemaWithRef).toEqual(uiSchemaWithoutAddress);
});
