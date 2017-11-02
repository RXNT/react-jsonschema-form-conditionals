import { normRules } from "../src/rulesRunner";

test("order from low to high ", () => {
  let unOrderedRules = [
    {
      conditions: "A",
      order: 1,
    },
    {
      conditions: "B",
      order: 0,
    },
    {
      conditions: "C",
      order: 2,
    },
  ];

  let orderedRules = [
    {
      conditions: "B",
      order: 0,
    },
    {
      conditions: "A",
      order: 1,
    },
    {
      conditions: "C",
      order: 2,
    },
  ];

  expect(normRules(unOrderedRules)).toEqual(orderedRules);
});

test("put without order as last ", () => {
  let unOrderedRules = [
    {
      conditions: "A",
    },
    {
      conditions: "B",
      order: 0,
    },
    {
      conditions: "D",
    },
    {
      conditions: "C",
      order: 2,
    },
    {
      conditions: "E",
    },
    {
      conditions: "F",
      order: 3,
    },
  ];

  let orderedRules = [
    {
      conditions: "B",
      order: 0,
    },
    {
      conditions: "C",
      order: 2,
    },
    {
      conditions: "F",
      order: 3,
    },
    {
      conditions: "A",
    },
    {
      conditions: "D",
    },
    {
      conditions: "E",
    },
  ];

  expect(normRules(unOrderedRules)).toEqual(orderedRules);
});

test("keep without order as last ", () => {
  let unOrderedRules = [
    {
      conditions: "A",
    },
    {
      conditions: "B",
    },
    {
      conditions: "C",
      order: 2,
    },
  ];

  let orderedRules = [
    {
      conditions: "C",
      order: 2,
    },
    {
      conditions: "A",
    },
    {
      conditions: "B",
    },
  ];

  expect(normRules(unOrderedRules)).toEqual(orderedRules);
});
