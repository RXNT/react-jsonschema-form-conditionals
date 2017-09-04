import require from "../../src/actions/require";
import deepcopy from "deepcopy";

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
  },
};

test("require from ref fields", () => {
  let resSchema = deepcopy(schema);
  require({ field: "address.zip" }, resSchema);

  let newDefinition = {
    address: {
      type: "object",
      required: ["zip"],
      properties: {
        street: { type: "string" },
        zip: { type: "string" },
      },
    },
  };

  let expSchema = Object.assign({}, schema, { definitions: newDefinition });
  expect(resSchema).toEqual(expSchema);
});

test("require from Object fields", () => {
  let resSchema = deepcopy(schema);
  require({ field: "profile.age" }, resSchema);

  let properties = Object.assign({}, schema.properties, {
    profile: {
      type: "object",
      required: ["age"],
      properties: {
        age: { type: "number" },
        height: { type: "number" },
      },
    },
  });

  let expSchema = Object.assign({}, schema, { properties });
  expect(resSchema).toEqual(expSchema);
});
