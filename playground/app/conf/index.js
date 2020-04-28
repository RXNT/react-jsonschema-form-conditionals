import Engine from "json-rules-engine-simplified";

const conf = {
  formData: {
    height: 174,
    heightMeasure: "cms",
    weight: 74,
    weightMeasure: "Kgs",
  },
  schema: {
    title: "Calculate BMI",
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
        type: "number",
        title: "Weight",
      },
      weightMeasure: {
        type: "string",
        title: "Weight Measure",
        enum: ["Lbs", "Kgs"],
      },
      bmi: {
        type: "number",
        title: "BMI",
      },
      oxygen: {
        type: "number",
        title: "Oxygen",
      },
    },
  },
  uiSchema: {
    height: {
      classNames: "col-md-3",
      "ui:autofocus": true,
    },
    heightMeasure: {
      classNames: "col-md-3",
    },
    weight: {
      classNames: "col-md-3",
    },
    weightMeasure: {
      classNames: "col-md-3",
    },
    bmi: {
      classNames: "col-md-3",
      "ui:disabled": true,
    },
    oxygen: {
      classNames: "col-md-3",
    },
  },
  rules: [
    {
      conditions: {
        height: { less: 0 },
      },
      event: {
        type: "remove",
        params: { field: ["bmi", "heightMeasure"] },
      },
    },
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
        type: "uiAppend",
        params: {
          bmi: {
            classNames: "has-error",
            "ui:disabled": false,
          },
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
        type: "uiAppend",
        params: {
          bmi: {
            classNames: "has-success",
          },
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
        type: "uiAppend",
        params: {
          bmi: {
            classNames: "has-warning",
          },
        },
      },
    },
    {
      conditions: { bmi: { lessEq: 15 } },
      event: {
        type: "uiOverride",
        params: { bmi: { "ui:help": "Very severely underweight" } },
      },
    },
    {
      conditions: { bmi: { greater: 15, lessEq: 16 } },
      event: {
        type: "uiOverride",
        params: { bmi: { "ui:help": "Severely underweight" } },
      },
    },
    {
      conditions: { bmi: { greater: 16, lessEq: 18.5 } },
      event: {
        type: "uiOverride",
        params: { bmi: { "ui:help": "Underweight" } },
      },
    },
    {
      conditions: { bmi: { greater: 18.5, lessEq: 25 } },
      event: {
        type: "uiOverride",
        params: { bmi: { "ui:help": "Normal" } },
      },
    },
    {
      conditions: { bmi: { greater: 25, lessEq: 30 } },
      event: {
        type: "uiOverride",
        params: { bmi: { "ui:help": "Overweight" } },
      },
    },
    {
      conditions: { bmi: { greater: 30, lessEq: 35 } },
      event: {
        type: "uiOverride",
        params: { bmi: { "ui:help": "Obese Class I (Moderately obese)" } },
      },
    },
    {
      conditions: { bmi: { greater: 35, lessEq: 40 } },
      event: {
        type: "uiOverride",
        params: { bmi: { "ui:help": "Obese Class II (Severely obese)" } },
      },
    },
    {
      conditions: { bmi: { greater: 40 } },
      event: {
        type: "uiOverride",
        params: { bmi: { "ui:help": "Obese Class III (Very severely obese)" } },
      },
    },
  ],
  extraActions: {
    calculateBMI: function ({ field }, schema, uiSchema, formData) {
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
      formData[field] = bmi;
    },
  },
  rulesEngine: Engine,
};

export default conf;
