import uiOverride from "../../src/actions/uiOverride";
import uiAppend from "../../src/actions/uiAppend";
import validateAction from "../../src/actions/validateAction";
import uiReplace from "../../src/actions/uiReplace";
import remove from "../../src/actions/remove";
import require from "../../src/actions/require";
import { isDevelopmentMock } from "../../src/env";
jest.mock("../../src/env");

afterEach(() => {
  isDevelopmentMock.mockClear();
});

let origUiSchema = {
  "ui:order": ["firstName"],
  lastName: {
    classNames: "col-md-1",
  },
  firstName: {
    "ui:disabled": false,
    num: 23,
  },
};

let origSchema = {
  properties: {
    lastName: { type: "string" },
    firstName: { type: "string" },
  },
};

function testInvalidParams(action, invalidParams) {
  return test(`${action.name} params ${JSON.stringify(
    invalidParams
  )} should be invalid`, () => {
    isDevelopmentMock.mockReturnValue(true);
    expect(() =>
      validateAction(action, invalidParams, origSchema, origUiSchema)
    ).toThrow();
    isDevelopmentMock.mockReturnValue(false);
    expect(
      validateAction(action, invalidParams, origSchema, origUiSchema)
    ).toBeUndefined();
  });
}

function testValidParams(action, validParams) {
  return test(`${action.name} params ${JSON.stringify(
    validParams
  )} should be valid`, () => {
    isDevelopmentMock.mockReturnValue(true);
    expect(
      validateAction(action, validParams, origSchema, origUiSchema)
    ).toBeUndefined();
    isDevelopmentMock.mockReturnValue(false);
    expect(
      validateAction(action, validParams, origSchema, origUiSchema)
    ).toBeUndefined();
  });
}

testInvalidParams(uiAppend, { firstname: { classNames: "col-md-12" } });
testValidParams(uiAppend, { firstName: "col-md-12" });

testInvalidParams(uiOverride, { firstname: { classNames: "col-md-12" } });
testValidParams(uiOverride, { firstName: { classNames: "col-md-12" } });

testInvalidParams(uiReplace, { firstname: { classNames: "col-md-12" } });
testValidParams(uiReplace, { firstName: { classNames: "col-md-12" } });

testInvalidParams(remove, { field: "firstname" });
testInvalidParams(remove, { field: ["firstname"] });
testValidParams(remove, { field: "firstName" });
testValidParams(remove, { field: ["firstName"] });

testInvalidParams(require, { field: "firstname" });
testInvalidParams(require, { field: ["firstname"] });
testValidParams(require, { field: "firstName" });
testValidParams(require, { field: ["firstName"] });
