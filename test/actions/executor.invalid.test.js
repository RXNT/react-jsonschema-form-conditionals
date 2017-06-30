import Executor from "../../src/actions/executor";
import { testInProd } from "../utils.test";

let schema = {
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    name: { type: "string" },
  },
};

let invalidRules = {
  password: {
    where: {},
  },
};

test("No error in production", () => {
  expect(() => new Executor(invalidRules, schema)).toThrow();
  expect(testInProd(() => new Executor(invalidRules, schema))).toBeDefined();
});
