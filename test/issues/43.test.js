import remove from "../../src/actions/remove";

const schema = {
  type: "object",
  properties: {
    firstName: {
      type: "string",
      title: "First Name",
    },
    lastName: {
      type: "string",
      title: "Last Name",
    },
  },
};
const uiSchema = {
  "ui:order": ["firstName", "lastName"],
};

test("remove updates uiOrder ", () => {
  remove({ field: ["firstName"] }, schema, uiSchema);

  expect(uiSchema["ui:order"]).toEqual(["lastName"]);
});
