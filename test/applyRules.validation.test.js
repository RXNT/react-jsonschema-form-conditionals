import applyRules from "../src";
import Engine from "json-rules-engine-simplified";
import sinon from "sinon";

let SCHEMA = {
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    name: { type: "string" },
  },
};

test("validation on creation", () => {
  expect(() => applyRules(SCHEMA, {}, [{}], Engine)).toThrow();
  expect(() =>
    applyRules(SCHEMA, {}, [{ conditions: "some" }], Engine)
  ).toThrow();
});

test("validation with PropTypes", () => {
  let consoleSpy = sinon.spy(console, "error");

  applyRules(
    SCHEMA,
    {},
    [{ conditions: { lastName: "empty" }, order: "1", event: { type: "1" } }],
    Engine
  );
  expect(consoleSpy.calledOnce).toEqual(true);
  applyRules(
    SCHEMA,
    {},
    [{ conditions: { lastName: "empty" }, order: 1, event: { type: 1 } }],
    Engine
  );
  expect(consoleSpy.calledTwice).toEqual(true);
  applyRules(
    SCHEMA,
    {},
    [{ conditions: { lastName: "empty" }, order: 1, event: { type: "1" } }],
    Engine
  );
  expect(consoleSpy.calledTwice).toEqual(true);
});
