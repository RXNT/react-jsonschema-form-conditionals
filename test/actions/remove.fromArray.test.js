import remove from "../../src/actions/remove";
import deepcopy from "deepcopy";

test("remove from array", () => {
  let origSchema = {
    type: "object",
    properties: {
      arr: {
        type: "array",
        items: {
          type: "object",
          properties: {
            foo: { type: "string" },
            boo: { type: "string" },
          },
        },
      },
    },
  };

  let field = "arr.boo";

  let expSchema = {
    type: "object",
    properties: {
      arr: {
        type: "array",
        items: {
          type: "object",
          properties: {
            foo: { type: "string" },
          },
        },
      },
    },
  };

  let schema = deepcopy(origSchema);
  remove({ field }, schema, {});
  expect(origSchema).not.toEqual(schema);
  expect(schema).toEqual(expSchema);
});
