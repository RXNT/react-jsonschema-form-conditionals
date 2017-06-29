import { check } from "../../src/engine/applicableActions";

test("single line empty check", () => {
  expect(check("", "empty")).toBeTruthy();
  expect(check(" ", "empty")).toBeFalsy();
});

test("single line NOT empty check", () => {
  expect(check("", { not: "empty" })).toBeFalsy();
  expect(check(" ", { not: "empty" })).toBeTruthy();
});

test("composite with greater", function () {
  expect(check(10, { greater: 5 })).toBeTruthy();
  expect(check(10, { greater: 15 })).toBeFalsy();
});
test("composite with NOT greater", function () {
  expect(check(10, { not: { greater: 5 } })).toBeFalsy();
  expect(check(10, { not: { greater: 15 } })).toBeTruthy();
});

test("AND in > 5 && < 12", function () {
  expect(check(10, { greater: 5 })).toBeTruthy();
  expect(check(10, { less: 12 })).toBeTruthy();
  expect(check(10, { greater: 5, less: 12 })).toBeTruthy();
  expect(check(15, { greater: 5, less: 12 })).toBeFalsy();
});

test("NOT with AND in ( > 5 && < 12) ", function () {
  expect(check(10, { not: { greater: 5 } })).toBeFalsy();
  expect(check(10, { not: { less: 12 } })).toBeFalsy();
  expect(check(10, { not: { greater: 5, less: 12 } })).toBeFalsy();
  expect(check(15, { not: { greater: 5, less: 12 } })).toBeFalsy();
});

test("OR with < 5 || > 12", function () {
  let rule = { or: [{ less: 5 }, { greater: 12 }] };
  expect(check(1, rule)).toBeTruthy();
  expect(check(8, rule)).toBeFalsy();
  expect(check(15, rule)).toBeTruthy();
});

test("or with array", function () {
  let rule = { or: [{ greater: 5, less: 12 }, { greater: 20, less: 30 }] };
  expect(check(1, rule)).toBeFalsy();
  expect(check(8, rule)).toBeTruthy();
  expect(check(15, rule)).toBeFalsy();
  expect(check(21, rule)).toBeTruthy();
  expect(check(31, rule)).toBeFalsy();
});

test("NOT empty check", function () {
  expect(check("", { not: "empty" })).toBeFalsy();
  expect(check(" ", { not: "empty" })).toBeTruthy();
});

test("double negation", function () {
  expect(check("", { not: { not: "empty" } })).toBeTruthy();
  expect(check(" ", { not: { not: "empty" } })).toBeFalsy();
});

