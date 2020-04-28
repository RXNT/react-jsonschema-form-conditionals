import applyRules from "../src";
import Engine from "json-rules-engine-simplified";
import sinon from "sinon";
import { testInProd } from "./utils";

let SCHEMA = {
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    name: { type: "string" },
  },
};

const formWithRules = (rules) => {
  try {
    applyRules(SCHEMA, {}, rules, Engine);
  } catch (error) {
    console.log(error);
  }
};

test("validation on creation", () => {
  expect(() => applyRules(SCHEMA, {}, [{}], Engine)).toThrow();
  expect(() =>
    applyRules(SCHEMA, {}, [{ conditions: "some" }], Engine)
  ).toThrow();
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
  expect(consoleErrorSpy.calledOnce).toEqual(true);
  formWithRules([
    {
      conditions: { lastName: "empty" },
      order: 1,
      event: { type: 1, params: { field: "name" } },
    },
  ]);
  expect(consoleErrorSpy.calledTwice).toEqual(true);
  // Everything is fine, console log was not called
  formWithRules([
    {
      conditions: { lastName: "empty" },
      order: 1,
      event: { type: "remove", params: { field: "name" } },
    },
  ]);
  expect(consoleErrorSpy.calledTwice).toEqual(true);
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
