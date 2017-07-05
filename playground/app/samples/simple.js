module.exports = {
  schema: {
    title: "A registration form",
    type: "object",
    required: ["firstName", "lastName"],
    properties: {
      firstName: {
        type: "string",
        title: "First name",
      },
      lastName: {
        type: "string",
        title: "Last name",
      },
      age: {
        type: "integer",
        title: "Age",
      },
      bio: {
        type: "string",
        title: "Bio",
      },
      password: {
        type: "string",
        title: "Password",
        minLength: 3,
      },
      telephone: {
        type: "string",
        title: "Telephone",
        minLength: 10,
      },
    },
  },
  uiSchema: {
    firstName: {
      classNames: "col-md-4 col-xs-4 success",
      "ui:autofocus": true,
      "ui:emptyValue": "",
    },
    lastName: {
      classNames: "col-md-4 col-xs-4",
    },
    age: {
      classNames: "col-md-4 col-xs-4",
      "ui:widget": "updown",
      "ui:title": "Age of person",
    },
    bio: {
      "ui:widget": "textarea",
      classNames: "col-md-12",
    },
    password: {
      classNames: "col-md-6 col-xs-6",
      "ui:widget": "password",
      "ui:help": "Hint: Make it strong!",
    },
    date: {
      classNames: "col-md-6 col-xs-6",
      "ui:widget": "alt-datetime",
    },
    telephone: {
      classNames: "col-md-6 col-xs-6",
      "ui:options": {
        inputType: "tel",
      },
    },
  },
  formData: {
    lastName: "Norris",
    bio: "Roundhouse kicking asses since 1940",
    password: "noneed",
  },
  rules: [
    {
      conditions: { firstName: "empty" },
      event: {
        type: "remove",
        params: { fields: ["password"] },
      },
    },
    {
      conditions: { age: { greater: 20 } },
      event: {
        type: "require",
        params: { fields: ["telephone"] },
      },
    },
  ],
};
