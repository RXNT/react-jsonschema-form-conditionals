import deepcopy from "deepcopy";
import uiAppend from "../../src/actions/uiAppend";

let origUiSchema = {
  "ui:order": ["firstName"],
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
  uiAppend(params, schema, uiSchema);
  expect(schema).toEqual({});
  expect(uiSchema).toEqual(params);
});

test("append required section", () => {
  let schema = deepcopy(origSchema);
  let uiSchema = deepcopy(origUiSchema);
  uiAppend(params, schema, uiSchema);
  expect(schema).toEqual(origSchema);
  let expectedUiSchema = {
    "ui:order": ["firstName", "lastName"],
    lastName: {
      classNames: "col-md-1 has-error",
    },
    firstName: {
      classNames: "col-md-6",
      "ui:disabled": true,
      num: 22,
    },
  };
  expect(uiSchema).toEqual(expectedUiSchema);
});
