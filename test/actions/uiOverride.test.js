import deepcopy from "deepcopy";
import uiOverride from "../../src/actions/uiOverride";

let origUiSchema = {
  title: {
    classNames: "col-md-1",
  },
  firstName: {
    arr: [1],
    "ui:disabled": false,
    num: 23,
  },
};

let origSchema = {
  properties: {
    title: { type: "string" },
    firstName: { type: "string" },
  },
};

let params = {
  title: {
    classNames: "has-error",
  },
  firstName: {
    classNames: "col-md-6",
    arr: [2],
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

test("append required section", () => {
  let schema = deepcopy(origSchema);
  let uiSchema = deepcopy(origUiSchema);
  uiOverride(params, schema, uiSchema);
  expect(schema).toEqual(origSchema);
  let expectedUiSchema = {
    title: {
      classNames: "has-error",
    },
    firstName: {
      classNames: "col-md-6",
      arr: [2],
      "ui:disabled": true,
      num: 22,
    },
  };
  expect(uiSchema).toEqual(expectedUiSchema);
});
