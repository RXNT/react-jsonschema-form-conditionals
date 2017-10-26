import { deepEquals } from "react-jsonschema-form/lib/utils";

test("Deep equal on large filed", () => {
  let a = {
    name: "some",
    func: () => true,
  };

  let b = {
    name: "some",
    func: () => true,
  };

  expect(deepEquals(a, b)).toBeTruthy();
});
