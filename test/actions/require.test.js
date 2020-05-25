import deepcopy from "deepcopy";
import requireFn from "../../src/actions/require";
import validateAction from "../../src/actions/validateAction";
import { isDevelopmentMock } from "../../src/env";
jest.mock("../../src/env");

let origUiSchema = {
  title: {},
  firstName: {},
};

let origSchema = {
  required: ["title"],
  properties: {
    title: { type: "string" },
    firstName: { type: "string" },
  },
};

test("add required section", () => {
  let schema = deepcopy(origSchema);
  let uiSchema = deepcopy(origUiSchema);

  requireFn({ field: "firstName" }, schema);

  let schemaWithTitleReq = {
    required: ["title", "firstName"],
    properties: {
      title: { type: "string" },
      firstName: { type: "string" },
    },
  };
  expect(schema).toEqual(schemaWithTitleReq);
  expect(uiSchema).toEqual(origUiSchema);
});

test("ignores already required field", () => {
  let schema = deepcopy(origSchema);
  let uiSchema = deepcopy(origUiSchema);

  requireFn({ field: ["title"] }, schema);

  expect(schema).toEqual(origSchema);
  expect(uiSchema).toEqual(origUiSchema);
});

test("require validates fields", () => {
  expect(() =>
    validateAction(requireFn, { field: ["totle"] }, origSchema, origUiSchema)
  ).toThrow();
  isDevelopmentMock.mockReturnValueOnce(false);
  expect(
    validateAction(requireFn, { field: ["totle"] }, origSchema, origUiSchema)
  ).toBeUndefined();
  expect(
    validateAction(requireFn, { field: ["title"] }, origSchema, origUiSchema)
  ).toBeUndefined();
});
