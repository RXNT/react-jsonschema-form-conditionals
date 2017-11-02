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

const formWithRules = rules => applyRules(SCHEMA, {}, rules, Engine);

test("validation on creation", () => {
  expect(() => formWithRules([{}])).toThrow();
  expect(() => formWithRules([{ conditions: "some" }])).toThrow();
});

test("validation with PropTypes", () => {
  let consoleSpy = sinon.spy(console, "error");
  formWithRules([
    { conditions: { lastName: "empty" }, order: "1", event: { type: "1" } },
  ]);
  expect(consoleSpy.calledOnce).toEqual(true);
  formWithRules([
    { conditions: { lastName: "empty" }, order: 1, event: { type: 1 } },
  ]);
  expect(consoleSpy.calledTwice).toEqual(true);
  formWithRules([
    { conditions: { lastName: "empty" }, order: 1, event: { type: "1" } },
  ]);
  expect(consoleSpy.calledTwice).toEqual(true);
  consoleSpy.restore();
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
