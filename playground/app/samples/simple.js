import SimplifiedRuleEngineFactory from "../../../src/engine/SimplifiedRuleEngineFactory";

const simple = {
  schema: {
    type: "object",
    required: ["firstName", "lastName"],
    properties: {
      height: {
        type: "integer",
        title: "Height",
      },
      heightMeasure: {
        type: "string",
        title: "Measure",
        enum: ["In", "ft", "cms"],
      },
      weight: {
        type: "integer",
        title: "Weight",
      },
      weightMeasure: {
        type: "string",
        title: "Measure",
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
      classNames: "col-md-6",
      "ui:autofocus": true,
    },
    heightMeasure: {
      classNames: "col-md-6",
    },
    weight: {
      classNames: "col-md-6",
    },
    weightMeasure: {
      classNames: "col-md-6",
    },
    bmi: {
      classNames: "col-md-6",
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
