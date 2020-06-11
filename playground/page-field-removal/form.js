import Engine from "json-rules-engine-simplified";

const conf = {
  formData: { },
  schema: {
    type: "object",
    properties: {
      username: { title: "Username", type: "string" },
      password: { title: "Password", type: "string" },
      message: { title: "Fill in username!", type: "null" },
    },
  },
  uiSchema: {},
  rules: [
    {
      conditions: {
        username: 'falsey',
      },
      event: {
        type: "remove",
        params: {
          field: ["password"]
        }
      },
    },
    {
      conditions: {
        username: 'truthy',
      },
      event: {
        type: "remove",
        params: {
          field: ["message"]
        }
      },
    }
  ],
  extraActions: {},
  rulesEngine: Engine,
};

export default conf;
