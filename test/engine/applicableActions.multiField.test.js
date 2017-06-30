import applicableActions from "../../src/engine/applicableActions";

const REMOVE_PASSWORD = { password: [{ action: "remove", conf: undefined }] };
const NO_ACTION = {};

let OR = {
  password: {
    when: { or: [{ firstName: "empty" }, { nickName: { is: "admin" } }] },
    action: "remove",
  },
};

test("OR works", () => {
  expect(applicableActions(OR, {})).toEqual(REMOVE_PASSWORD);
  expect(
    applicableActions(OR, { firstName: "Steve", nickName: "admin" })
  ).toEqual(REMOVE_PASSWORD);
  expect(applicableActions(OR, { firstName: "some" })).toEqual(NO_ACTION);
  expect(
    applicableActions(OR, { firstName: "Steve", nickName: "Wonder" })
  ).toEqual(NO_ACTION);
});

let AND = {
  password: [
    {
      when: {
        and: [
          { or: [{ firstName: "empty" }, { nickName: { is: "admin" } }] },
          { age: { is: 21 } },
        ],
      },
      action: "remove",
    },
  ],
};

test("AND works", () => {
  expect(applicableActions(AND, {})).toEqual(NO_ACTION);
  expect(applicableActions(AND, { age: 21 })).toEqual(REMOVE_PASSWORD);
  expect(applicableActions(AND, { firstName: "some" })).toEqual(NO_ACTION);
  expect(
    applicableActions(AND, { firstName: "Steve", nickName: "Wonder" })
  ).toEqual(NO_ACTION);
  expect(
    applicableActions(AND, { firstName: "Steve", nickName: "admin" })
  ).toEqual(NO_ACTION);
  expect(
    applicableActions(AND, { firstName: "Steve", nickName: "admin", age: 21 })
  ).toEqual(REMOVE_PASSWORD);
});
