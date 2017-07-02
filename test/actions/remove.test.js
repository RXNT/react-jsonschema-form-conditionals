import deepcopy from "deepcopy";
import remove from "../../src/actions/remove";

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
  remove({ fields: ["title"] }, schema, uiSchema);

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
  remove({ fields: ["lastName"] }, schema, uiSchema);
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

  remove({ fields: ["title"] }, schema, uiSchema);

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
