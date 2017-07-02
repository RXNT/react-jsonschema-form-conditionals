import deepcopy from "deepcopy";
import replaceUi from "../../src/actions/replaceUi";

let origUiSchema = {
  title: {},
  firstName: {},
};

let origSchema = {
  properties: {
    title: { type: "string" },
    firstName: { type: "string" },
  },
};

test("default values", () => {
  let schema = {};
  let uiSchema = {};
  replaceUi({ fields: ["title"], conf: {} }, schema, uiSchema);
  expect(schema).toEqual({});
  expect(uiSchema).toEqual({ title: {} });
});

test("add required section", () => {
  let conf = {
    classNames: "col-md-5",
  };
  let schema = deepcopy(origSchema);
  let uiSchema = deepcopy(origUiSchema);
  replaceUi({ fields: ["title"], conf }, schema, uiSchema);
  expect(schema).toEqual(origSchema);

  let expectedUiSchema = {
    title: conf,
    firstName: {},
  };
  expect(uiSchema).toEqual(expectedUiSchema);
});
