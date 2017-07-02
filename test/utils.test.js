import {
  rulesIterator,
  flatMap,
  isObject,
  isDevelopment,
  toError,
} from "../src/utils";

import { testInProd } from "./utils";

test("empty rules", () => {
  expect(rulesIterator()).toEqual([]);
  expect(rulesIterator({})).toEqual([]);
});

test("all rules extracted", () => {
  let rules = {
    password: {
      where: { firstName: "empty" },
      action: "remove",
    },
    firstName: [
      {
        where: { lastName: "empty" },
        action: "require",
      },
      {
        where: { lastName: "empty" },
        action: "remove",
      },
    ],
  };

  let expected = [rules.password, rules.firstName[0], rules.firstName[1]];
  expect(rulesIterator(rules)).toEqual(expected);
});

test("array flatmap", () => {
  expect(flatMap([[1, 2], [3], [4, 5]], x => x)).toEqual([1, 2, 3, 4, 5]);
});

test("isObject", () => {
  expect(isObject(undefined)).toBeFalsy();
  expect(isObject("")).toBeFalsy();
  expect(isObject(null)).toBeFalsy();
  expect(isObject(1)).toBeFalsy();
  expect(isObject({})).toBeTruthy();
});

test("isProduction", () => {
  expect(isDevelopment()).toBeTruthy();
  expect(testInProd(() => isDevelopment())).toBeFalsy();
});

test("error throws exception", () => {
  expect(() => toError("Yes")).toThrow();
  expect(testInProd(() => toError("Yes"))).toBeUndefined();
});
