import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import applyRules from "../src";
import Engine from "json-rules-engine-simplified";
import sinon from "sinon";
import { testInProd } from "./utils";

configure({ adapter: new Adapter() });

let SCHEMA = {
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    name: { type: "string" },
  },
};

const formWithRules = rules => {
  const Form = applyRules(SCHEMA, {}, rules, Engine)();
  return mount(<Form />);
};

test("validation on creation", () => {
  expect(() => {
    const Form = applyRules(SCHEMA, {}, [{}], Engine)();
    return mount(<Form />);
  }).toThrow(/Rule contains invalid action "undefined"/);
  expect(() => {
    const Form = applyRules(SCHEMA, {}, [{ conditions: "some" }], Engine)();
    return mount(<Form />);
  }).toThrow(/Rule contains invalid action "undefined"/);
});

test("validation with PropTypes", () => {
  let consoleErrorSpy = sinon.spy(console, "error");
  // order is a string
  formWithRules([
    {
      conditions: { lastName: "empty" },
      order: "1",
      event: { type: "remove", params: { field: "name" } },
    },
  ]);
  // type is a number
  expect(consoleErrorSpy.called).toBe(true);
  consoleErrorSpy.reset();
  expect(() => {
    formWithRules([
      {
        conditions: { lastName: "empty" },
        order: 1,
        event: { type: 1, params: { field: "name" } },
      },
    ]);
  }).toThrow();
  expect(consoleErrorSpy.called).toBe(true);
  consoleErrorSpy.reset();
  // Everything is fine, console log was not called
  formWithRules([
    {
      conditions: { lastName: "empty" },
      order: 1,
      event: { type: "remove", params: { field: "name" } },
    },
  ]);
  expect(consoleErrorSpy.called).toBe(false);
  consoleErrorSpy.restore();
});

test("validation PropTypes ignored in prod", () => {
  let consoleSpy = sinon.spy(console, "error");
  testInProd(() =>
    formWithRules([
      { conditions: { lastName: "empty" }, order: "1", event: { type: "1" } },
    ])
  );
  expect(consoleSpy.calledOnce).toEqual(false);
  testInProd(() =>
    formWithRules([
      { conditions: { lastName: "empty" }, order: 1, event: { type: 1 } },
    ])
  );
  expect(consoleSpy.calledTwice).toEqual(false);
  testInProd(() =>
    formWithRules([
      { conditions: { lastName: "empty" }, order: 1, event: { type: "1" } },
    ])
  );
  expect(consoleSpy.calledTwice).toEqual(false);
  consoleSpy.restore();
});
