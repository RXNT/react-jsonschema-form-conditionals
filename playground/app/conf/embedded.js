import Engine from "json-rules-engine-simplified";

const conf = {
  schema: {
    type: "object",
    properties: {
      general: {
        type: "object",
        properties: {
          firstName: {
            type: "string",
            title: "First Name",
          },
          lastName: {
            type: "string",
            title: "Last Name",
          },
        },
      },
    },
  },
  uiSchema: {
    general: {
      "ui:order": ["firstName", "lastName"],
    },
  },
  formData: {
    firstName: "adming",
    heightMeasure: "cms",
    weight: 117,
    weightMeasure: "Kgs",
  },
  rules: [
    {
      conditions: {
        "general.firstName": { is: "admin" },
      },
      event: {
        type: "remove",
        params: {
          field: ["general.firstName"],
        },
      },
    },
  ],
  rulesEngine: Engine,
};

export default conf;
