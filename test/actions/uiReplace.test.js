import deepcopy from "deepcopy";
import uiReplace from "../../src/actions/uiReplace";

let origUiSchema = {
  lastName: {
    classNames: "col-md-1",
  },
  firstName: {
    arr: [1],
    "ui:disabled": false,
    num: 23,
  },
  nickName: {
    classNames: "col-md-12",
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
    arr: [2],
    "ui:disabled": true,
    num: 22,
  },
};

test("default values", () => {
  let schema = {};
  let uiSchema = {};
  uiReplace(params, schema, uiSchema);
  expect(schema).toEqual({});
  expect(uiSchema).toEqual(params);
});

test("replace required section", () => {
  let schema = deepcopy(origSchema);
  let uiSchema = deepcopy(origUiSchema);
  uiReplace(params, schema, uiSchema);
  expect(schema).toEqual(origSchema);
  expect(uiSchema).toEqual(
    Object.assign(params, { nickName: origUiSchema.nickName })
  );
});
