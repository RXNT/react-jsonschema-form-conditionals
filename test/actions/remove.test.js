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

test("default values", () => {
  let { schema, uiSchema } = remove("title");
  expect(schema).toEqual({ properties: {} });
  expect(uiSchema).toEqual({});
});

test("removes field", () => {
  let { schema, uiSchema } = remove(
    "title",
    deepcopy(origSchema),
    deepcopy(origUiSchema)
  );

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
  let { schema, uiSchema } = remove(
    "lastName",
    deepcopy(origSchema),
    deepcopy(origUiSchema)
  );
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

  let { schema, uiSchema } = remove(
    "title",
    deepcopy(origSchema),
    deepcopy(origUiSchema)
  );

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
