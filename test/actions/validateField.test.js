import { validateFields } from "../../src/utils";
import { testInProd } from "./../utils";

function checkValidParams(fetchFunction, params, schema, uiSchema) {
  let validator = validateFields("fakeAction", fetchFunction);
  return test("field valid params on schema", () => {
    expect(validator(params, schema, uiSchema)).toBeUndefined();
  });
}

function checkInValidParams(fetchFunction, params, schema, uiSchema) {
  let validator = validateFields("fakeAction", fetchFunction);
  return test("field INvalid params on schema", () => {
    expect(() => validator(params, schema, uiSchema)).toThrow();
    expect(
      testInProd(() => validator(params, schema, uiSchema))
    ).toBeUndefined();
  });
}

let schema = {
  properties: {
    lastName: { type: "string" },
    firstName: { type: "string" },
  },
};

checkValidParams(["lastName"], {}, schema);
checkValidParams("lastName", {}, schema);
checkValidParams(() => "lastName", {}, schema);
checkValidParams(() => ["lastName"], {}, schema);

checkInValidParams(["lastname"], {}, schema);
checkInValidParams("lastname", {}, schema);
checkInValidParams(() => "lastname", {}, schema);
checkInValidParams(() => ["lastname"], {}, schema);

test("validate field construction", () => {
  expect(validateFields("fakeAction", [])).not.toBeUndefined();
  expect(validateFields("fakeAction", () => [])).not.toBeUndefined();
  expect(
    testInProd(() => validateFields("fakeAction", () => "a"))
  ).not.toBeUndefined();
  expect(() => validateFields("fakeAction")).toThrow();
  expect(() => validateFields("fakeAction", null)).toThrow();
  expect(
    testInProd(() => validateFields("fakeAction", undefined))
  ).toBeUndefined();
  expect(testInProd(() => validateFields("fakeAction"))).toBeUndefined();
  expect(testInProd(() => validateFields("fakeAction", null))).toBeUndefined();
  expect(
    testInProd(() => validateFields("fakeAction", undefined))
  ).toBeUndefined();
});
