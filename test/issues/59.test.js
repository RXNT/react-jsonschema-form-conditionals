import Engine from "json-rules-engine-simplified";
import applyRules from "../../src/applyRules";

const rules = [
  {
    conditions: {
      hasBenefitsReference: { is: true },
    },
    event: [
      {
        type: "require",
        params: {
          field: ["hasBD2Reference", "BD2Reference"],
        },
      },
    ],
  },
];

const schema = {
  type: "object",
  properties: {
    hasBenefitsReference: {
      title: "Do you have a Benefits Reference Number?",
      type: "boolean",
    },
    benefitsReference: {
      title: "Benefits Reference Number",
      type: "string",
    },
    hasBD2Reference: {
      title: "Do you have a BD2 Number?",
      type: "boolean",
    },
    BD2Reference: {
      title: "BD2 Number",
      type: "string",
    },
  },
};

test("Processes events with 2 events", () => {
  expect(applyRules(schema, {}, rules, Engine)).not.toBeUndefined();
});
