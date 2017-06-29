import deepcopy from 'deepcopy';
import require from "./require";

let origUiSchema = {
  title: {},
  firstName: {}
};

test("default values", () => {
  let { schema, uiSchema } = require("title");
  expect(schema).toEqual({ required: ["title"], properties: {} });
  expect(uiSchema).toEqual({});
});

test("add required section", () => {
  let origSchema = {
    properties: {
      title: { type: "string" },
      firstName: { type: "string" }
    }
  };

  let { schema, uiSchema } = require("title", deepcopy(origSchema), deepcopy(origUiSchema));
  let schemaWithTitleReq = {
    required: [ "title" ],
    properties: {
      title: { type: "string" },
      firstName: { type : "string" }
    }
  };
  expect(schema).toEqual(schemaWithTitleReq);
  expect(uiSchema).toEqual(origUiSchema);
});

test("ignores already required field", () => {
  let origSchema = {
    required: [ "title" ],
    properties: {
      title: { type: "string" },
      firstName: { type: "string" }
    }
  };
  let { schema, uiSchema } = require("title", deepcopy(origSchema), deepcopy(origUiSchema));
  expect(schema).toEqual(origSchema);
  expect(uiSchema).toEqual(origUiSchema);
});