import execute from "../../src/actions";
import { testInProd } from "../utils";

let schema = {
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    name: { type: "string" },
  },
};

let invalidAction = {
  type: "removes",
  field: ["firstName"],
};

test("No error in production", () => {
  expect(() => execute(invalidAction, schema, {}, {})).toThrow();
  expect(
    testInProd(() => execute(invalidAction, schema, {}, {}))
  ).toBeUndefined();
});
