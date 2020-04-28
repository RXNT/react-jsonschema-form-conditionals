import deepcopy from "deepcopy";
import remove from "../../src/actions/remove";
import validateAction from "../../src/actions/validateAction";
import { isDevelopmentMock } from "../../src/env";
jest.mock("../../src/env");

let origSchema = {
  properties: {
    title: { type: "string" },
    firstName: { type: "string" },
  },
};
let origUiSchema = {
  title: {},
  firstName: {},
};

test("removes field", () => {
  let schema = deepcopy(origSchema);
  let uiSchema = deepcopy(origUiSchema);
  remove({ field: ["title"] }, schema, uiSchema);

  let schemaWithoutTitle = {
    properties: {
      firstName: { type: "string" },
    },
  };
  expect(schema).toEqual(schemaWithoutTitle);

  let uiSchemaWithoutTitle = {
    firstName: {},
  };
  expect(uiSchema).toEqual(uiSchemaWithoutTitle);
});

test("ignores invalid field", () => {
  let schema = deepcopy(origSchema);
  let uiSchema = deepcopy(origUiSchema);
  remove({ field: "lastName" }, schema, uiSchema);
  expect(schema).toEqual(origSchema);
  expect(uiSchema).toEqual(origUiSchema);
});

test("remove required", () => {
  let origSchema = {
    required: ["title"],
    properties: {
      title: { type: "string" },
      firstName: { type: "string" },
    },
  };

  let schema = deepcopy(origSchema);
  let uiSchema = deepcopy(origUiSchema);

  remove({ field: "title" }, schema, uiSchema);

  let schemaWithoutTitle = {
    required: [],
    properties: {
      firstName: { type: "string" },
    },
  };
  expect(schema).toEqual(schemaWithoutTitle);

  let uiSchemaWithoutTitle = {
    firstName: {},
  };
  expect(uiSchema).toEqual(uiSchemaWithoutTitle);
});

test("remove validates fields", () => {
  expect(() =>
    validateAction(remove, { field: ["totle"] }, origSchema, origUiSchema)
  ).toThrow();
  isDevelopmentMock.mockReturnValueOnce(false);
  expect(
    validateAction(remove, { field: ["totle"] }, origSchema, origUiSchema)
  ).toBeUndefined();
  expect(
    validateAction(remove, { field: ["title"] }, origSchema, origUiSchema)
  ).toBeUndefined();
});
