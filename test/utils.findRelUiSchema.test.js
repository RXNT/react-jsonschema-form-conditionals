import { findRelUiSchema } from "../src/utils";

let uiSchema = {
  lastName: {
    classNames: "col-md-12",
  },
  age: {
    classNames: "col-md-3",
  },
  someAddress: {
    street: {
      className: "col-md-6",
    },
    zip: {
      className: "col-md-6",
    },
  },
  houses: {
    street: {
      className: "col-md-9",
    },
    zip: {
      className: "col-md-3",
    },
  },
};

test("extract relevant uiSchema for general field", () => {
  expect(findRelUiSchema("lastName", uiSchema)).toEqual(uiSchema);
  expect(findRelUiSchema("age", uiSchema)).toEqual(uiSchema);
});

test("extract relevant uiSchema for embedded field", () => {
  expect(findRelUiSchema("someAddress.street", uiSchema)).toEqual(
    uiSchema.someAddress
  );
  expect(findRelUiSchema("someAddress.zip", uiSchema)).toEqual(
    uiSchema.someAddress
  );
});

test("extract relevant uiSchema for embedded array field", () => {
  expect(findRelUiSchema("houses.street", uiSchema)).toEqual(uiSchema.houses);
  expect(findRelUiSchema("houses.zip", uiSchema)).toEqual(uiSchema.houses);
});
