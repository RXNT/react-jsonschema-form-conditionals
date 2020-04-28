import { validateFields } from "../../src/actions/validateAction";
import { isDevelopmentMock } from "../../src/env";
jest.mock("../../src/env");

beforeEach(() => {
  isDevelopmentMock.mockReturnValue(true);
});

function checkValidParams(fetchFunction, params, schema, uiSchema) {
  let validator = validateFields("fakeAction", fetchFunction);
  return test("field valid params on schema", () => {
    expect(validator(params, schema, uiSchema)).toBeUndefined();
  });
}

function checkInValidParams(fetchFunction, params, schema, uiSchema) {
  let validator = validateFields("fakeAction", fetchFunction);
  return test("field inValid params on schema", () => {
    expect(() => validator(params, schema, uiSchema)).toThrow();
    isDevelopmentMock.mockReturnValueOnce(false);
    expect(validator(params, schema, uiSchema)).toBeUndefined();
  });
}

let schema = {
  properties: {
    lastName: { type: "string" },
    firstName: { type: "string" },
  },
};

checkValidParams(() => ["lastName"], {}, schema);
checkValidParams(() => "lastName", {}, schema);
checkValidParams(() => "lastName", {}, schema);
checkValidParams(() => ["lastName"], {}, schema);

checkInValidParams(() => ["lastname"], {}, schema);
checkInValidParams(() => "lastname", {}, schema);
checkInValidParams(() => "lastname", {}, schema);
checkInValidParams(() => ["lastname"], {}, schema);

test("validate field construction", () => {
  expect(validateFields("fakeAction", () => [])).not.toBeUndefined();
  expect(validateFields("fakeAction", () => [])).not.toBeUndefined();
  expect(() => validateFields("fakeAction")).toThrow();
  expect(() => validateFields("fakeAction", null)).toThrow();

  isDevelopmentMock.mockReturnValue(false);
  expect(validateFields("fakeAction", () => "a")).not.toBeUndefined();
  expect(validateFields("fakeAction", undefined)).toBeUndefined();
  expect(validateFields("fakeAction")).toBeUndefined();
  expect(validateFields("fakeAction", null)).toBeUndefined();
  expect(validateFields("fakeAction", undefined)).toBeUndefined();
});

test("validate field checks for a function", () => {
  expect(validateFields("fakeAction", [])).not.toBeUndefined();
  expect(validateFields("fakeAction", () => [])).not.toBeUndefined();
  expect(() => validateFields("fakeAction")).toThrow();
  expect(() => validateFields("fakeAction", null)).toThrow();

  isDevelopmentMock.mockReturnValue(false);
  expect(validateFields("fakeAction", () => "a")).not.toBeUndefined();
  expect(validateFields("fakeAction", undefined)).toBeUndefined();
  expect(validateFields("fakeAction")).toBeUndefined();
  expect(validateFields("fakeAction", null)).toBeUndefined();
  expect(validateFields("fakeAction", undefined)).toBeUndefined();
});
