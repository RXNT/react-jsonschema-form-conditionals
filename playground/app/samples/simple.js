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
    heightMeasure: "In",
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
        type: "updateBMI",
        params: { field: "bmi" },
      },
    },
  ],
  extraActions: {
    updateBMI: function({ field }, schema, uiSchema, formData) {
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
      formData[field] = (weightKilo / (heightMeters * heightMeters)).toFixed(2);
    },
  },
  rulesEngine: SimplifiedRuleEngineFactory,
};

export default simple;
