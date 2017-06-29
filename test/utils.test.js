import { rulesIterator } from "../src/utils";

test("empty rules", () => {
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
    ],
  };

  let expected = [rules.password, rules.firstName[0]];
  expect(rulesIterator(rules)).toEqual(expected);
});
