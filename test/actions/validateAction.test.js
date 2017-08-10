import uiOverride from "../../src/actions/uiOverride";
import uiAppend from "../../src/actions/uiAppend";
import { testInProd } from "../utils";
import validateAction from "../../src/actions/validateAction";
import uiReplace from "../../src/actions/uiReplace";
import remove from "../../src/actions/remove";
import require from "../../src/actions/require";

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

function invalidParams(action, invalidParams) {
  return test(`${action.name} invalid params for detected`, () => {
    expect(() =>
      validateAction(action, invalidParams, origSchema, origUiSchema)
    ).toThrow();
    expect(
      testInProd(() =>
        validateAction(action, invalidParams, origSchema, origUiSchema)
      )
    ).toBeUndefined();
  });
}

function validParams(action, validParams) {
  return test(`${action.name} valid params for detected`, () => {
    expect(
      validateAction(action, validParams, origSchema, origUiSchema)
    ).toBeUndefined();
    expect(
      testInProd(() =>
        validateAction(action, validParams, origSchema, origUiSchema)
      )
    ).toBeUndefined();
  });
}

invalidParams(uiAppend, { firstname: { classNames: "col-md-12" } });
validParams(uiAppend, { firstName: "col-md-12" });

invalidParams(uiOverride, { firstname: { classNames: "col-md-12" } });
validParams(uiOverride, { firstName: { classNames: "col-md-12" } });

invalidParams(uiReplace, { firstname: { classNames: "col-md-12" } });
validParams(uiReplace, { firstName: { classNames: "col-md-12" } });

invalidParams(remove, { field: "firstname" });
invalidParams(remove, { field: ["firstname"] });
validParams(remove, { field: "firstName" });
validParams(remove, { field: ["firstName"] });

invalidParams(require, { field: "firstname" });
invalidParams(require, { field: ["firstname"] });
validParams(require, { field: "firstName" });
validParams(require, { field: ["firstName"] });
