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
  let { schema, uiSchema } = replaceUi("title");
  expect(schema).toEqual({});
  expect(uiSchema).toEqual({ title: {} });
});

test("add required section", () => {
  let configs = {
    classNames: "col-md-5",
  };
  let { schema, uiSchema } = replaceUi(
    "title",
    deepcopy(origSchema),
    deepcopy(origUiSchema),
    configs
  );
  expect(schema).toEqual(origSchema);

  let expectedUiSchema = {
    title: configs,
    firstName: {},
  };
  expect(uiSchema).toEqual(expectedUiSchema);
});
