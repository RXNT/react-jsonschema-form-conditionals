import { SimplifiedRuleEngineFactory } from "../../../src/";

const simple = {
  schema: {
    type: "object",
    properties: {
      height: {
        type: "integer",
        title: "Height",
      },
      heightMeasure: {
        type: "string",
        title: "Height Measure",
        enum: ["In", "ft", "cms"],
      },
      weight: {
        type: "integer",
        title: "Weight",
      },
      weightMeasure: {
        type: "string",
        title: "Weight Measure",
        enum: ["Lbs", "Kgs"],
      },
      bmi: {
        type: "integer",
        title: "BMI",
      },
    },
  },
  uiSchema: {
    height: {
      classNames: "col-md-9",
      "ui:autofocus": true,
    },
    heightMeasure: {
      classNames: "col-md-3",
    },
    weight: {
      classNames: "col-md-9",
    },
    weightMeasure: {
      classNames: "col-md-3",
    },
    bmi: {
      classNames: "col-md-9",
      "ui:disabled": true,
    },
  },
  formData: {
    height: 181,
    heightMeasure: "cms",
    weight: 117,
    weightMeasure: "Kgs",
  },
  rules: [
    {
      conditions: {
        height: { greater: 0 },
        heightMeasure: { not: "empty" },
        weight: { greater: 0 },
        weightMeasure: { not: "empty" },
      },
      event: {
        type: "calculateBMI",
        params: { field: "bmi" },
      },
    },
    {
      conditions: {
        bmi: { greater: 25 },
      },
      event: {
        type: "appendClass",
        params: {
          field: "bmi",
          classNames: "has-error",
        },
      },
    },
    {
      conditions: {
        bmi: {
          greater: 18.5,
          lessEq: 25,
        },
      },
      event: {
        type: "appendClass",
        params: {
          field: "bmi",
          classNames: "has-success",
        },
      },
    },
    {
      conditions: {
        bmi: {
          lessEq: 18.5,
        },
      },
      event: {
        type: "appendClass",
        params: {
          field: "bmi",
          classNames: "has-warning",
        },
      },
    },
  ],
  extraActions: {
    calculateBMI: function({ field }, schema, uiSchema, formData) {
      function severity(bmi) {
        if (bmi <= 15) {
          return "Very severely underweight";
        } else if (bmi <= 16) {
          return "Severely underweight";
        } else if (bmi <= 18.5) {
          return "Underweight";
        } else if (bmi <= 25) {
          return "Normal";
        } else if (bmi <= 30) {
          return "Overweight";
        } else if (bmi <= 35) {
          return "Obese Class I (Moderately obese)";
        } else if (bmi <= 40) {
          return "Obese Class II (Severely obese)";
        } else {
          return "Obese Class III (Very severely obese)";
        }
      }
      let weightKilo = formData.weight;
      switch (formData.weightMeasure) {
        case "Lbs":
          weightKilo = formData.weight * 0.453592;
          break;
      }
      let heightMeters = formData.height / 100;
      switch (formData.heightMeasure) {
        case "In":
          heightMeters = formData.height * 0.0254;
          break;
        case "ft":
          heightMeters = formData.height * 0.3048;
          break;
      }
      if (!uiSchema[field]) {
        uiSchema[field] = {};
      }
      let bmi = (weightKilo / (heightMeters * heightMeters)).toFixed(2);
      uiSchema[field]["ui:help"] = severity(bmi);
      formData[field] = bmi;
    },
  },
  rulesEngine: SimplifiedRuleEngineFactory,
};

export default simple;
