import deepcopy from "deepcopy";
import require from "../../src/actions/require";

let origUiSchema = {
  title: {},
  firstName: {},
};

test("add required section", () => {
  let origSchema = {
    properties: {
      title: { type: "string" },
      firstName: { type: "string" },
    },
  };

  let schema = deepcopy(origSchema);
  let uiSchema = deepcopy(origUiSchema);

  require({ field: "title" }, schema, uiSchema);
  let schemaWithTitleReq = {
    required: ["title"],
    properties: {
      title: { type: "string" },
      firstName: { type: "string" },
    },
  };
  expect(schema).toEqual(schemaWithTitleReq);
  expect(uiSchema).toEqual(origUiSchema);
});

test("ignores already required field", () => {
  let origSchema = {
    required: ["title"],
    properties: {
      title: { type: "string" },
      firstName: { type: "string" },
    },
  };
  let schema = deepcopy(origSchema);
  let uiSchema = deepcopy(origUiSchema);
  require({ field: ["title"] }, schema, uiSchema);
  expect(schema).toEqual(origSchema);
  expect(uiSchema).toEqual(origUiSchema);
});
