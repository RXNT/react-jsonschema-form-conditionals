import deepcopy from "deepcopy";
import require from "../../src/actions/require";
import validateAction from "../../src/actions/validateAction";

let schema = {
  definitions: {
    address: {
      type: "object",
      properties: {
        street: { type: "string" },
        zip: { type: "string" },
      },
    },
  },
  properties: {
    title: { type: "string" },
    firstName: { type: "string" },
    address: { $ref: "#/definitions/address" },
    profile: {
      type: "object",
      properties: {
        age: { type: "number" },
        height: { type: "number" },
      },
    },
    email: {
      $ref: "https://example.com/schema/email.json",
    },
  },
};

test("validate nested field", () => {
  let resSchema = deepcopy(schema);
  require({ field: "address.zip" }, resSchema);

  expect(() =>
    validateAction(require, { field: "email.host" }, schema, {})
  ).toThrow();
  expect(() =>
    validateAction(require, { field: "profile.weight" }, schema, {})
  ).toThrow();
  expect(
    validateAction(require, { field: "profile.height" }, schema, {})
  ).toBeUndefined();
});
