import deepcopy from "deepcopy";
import uiOverride from "../../src/actions/uiOverride";

let origUiSchema = {
  "ui:order": ["bar", "foo"],
  lastName: {
    classNames: "col-md-1",
  },
  firstName: {
    "ui:disabled": false,
    num: 23,
  },
};

let origSchema = {
  properties: {
    lastName: { type: "string" },
    firstName: { type: "string" },
  },
};

let params = {
  "ui:order": ["lastName"],
  lastName: {
    classNames: "has-error",
  },
  firstName: {
    classNames: "col-md-6",
    "ui:disabled": true,
    num: 22,
  },
};

test("default values", () => {
  let schema = {};
  let uiSchema = {};
  uiOverride(params, schema, uiSchema);
  expect(schema).toEqual({});
  expect(uiSchema).toEqual(params);
});

test("override required section", () => {
  let schema = deepcopy(origSchema);
  let uiSchema = deepcopy(origUiSchema);
  uiOverride(params, schema, uiSchema);
  expect(schema).toEqual(origSchema);
  let expectedUiSchema = {
    "ui:order": ["lastName"],
    lastName: {
      classNames: "has-error",
    },
    firstName: {
      classNames: "col-md-6",
      "ui:disabled": true,
      num: 22,
    },
  };
  expect(uiSchema).toEqual(expectedUiSchema);
});
