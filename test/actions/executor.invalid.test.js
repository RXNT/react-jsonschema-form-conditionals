import toAction from "../../src/actions";
import { testInProd } from "../utils";

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
  expect(() => toAction(invalidRules, schema)).toThrow();
  expect(testInProd(() => toAction(invalidRules, schema))).toBeUndefined();
});
