import React from "react";
import Form from "react-jsonschema-form";
import Engine from "json-rules-engine-simplified";
import applyRules from "../../src";
import sinon from "sinon";
import Adapter from "enzyme-adapter-react-16";
import { mount, configure } from "enzyme";
import FormWithConditionals from "../../src/FormWithConditionals";

configure({ adapter: new Adapter() });

let schema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
  },
};

let uiSchema = {
  firstName: {},
  lastName: {},
};

test("no exception on formData undefined", () => {
  let ResForm = applyRules(
    schema,
    uiSchema,
    [
      {
        conditions: { firstName: { is: "An" } },
        event: { type: "remove", params: { field: "lastName" } },
      },
    ],
    Engine
  )(Form);

  const updateConfSpy = sinon.spy(FormWithConditionals.prototype, "updateConf");

  mount(<ResForm formData={undefined} />);
  expect(updateConfSpy.calledOnce).toEqual(true);
  expect(updateConfSpy.threw()).toEqual(false);
});
