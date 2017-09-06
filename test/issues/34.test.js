import runRules from "../../src/runRules";
import rulesEngine from "json-rules-engine-simplified";

function populateField(field, val, formData) {
  let separator = field.indexOf(".");
  if (separator === -1) {
    return (formData[field] = val);
  } else {
    let parentField = field.substr(0, separator);
    return populateField(
      field.substr(separator + 1),
      val,
      formData[parentField]
    );
  }
}

const extraActions = {
  populate: function({ options }, schema, uiSchema, formData) {
    Object.keys(options).forEach(field =>
      populateField(field, options[field], formData)
    );
  },
};

const origSchema = {
  type: "object",
  properties: {
    registration: {
      type: "object",
      properties: {
        firstName: { type: "string" },
        lastName: { type: "string" },
        gender: { type: "string" },
        email: { type: "string" },
        password: { type: "string" },
        confirmPassword: { type: "string" },
      },
    },
    address: {
      type: "object",
      properties: {
        zip: { type: "string" },
      },
    },
  },
};

const hideNonRelevant = {
  title: "Rule #2",
  description:
    "This hides Address, Email, Gender and the Password fields until First Name and Last Name have a value",
  conditions: {
    and: [
      {
        or: [
          {
            "registration.firstName": "empty",
          },
          {
            "registration.lastName": "empty",
          },
        ],
      },
    ],
  },
  event: {
    type: "remove",
    params: {
      field: [
        "address",
        "registration.gender",
        "registration.email",
        "registration.password",
        "registration.confirmPassword",
      ],
    },
  },
};

const fillDefaults = {
  title: "Rule #3",
  description: "prefills firstName",
  conditions: {
    and: [
      {
        "registration.firstName": {
          equal: "Barry",
        },
      },
    ],
  },
  event: {
    params: {
      field: ["registration.lastName"],
      options: {
        "registration.lastName": "White",
        "registration.gender": "Male",
      },
    },
    type: "populate",
  },
};

test("Direct rule", () => {
  return runRules(
    { registration: { firstName: "Barry" } },
    {
      rulesEngine,
      rules: [hideNonRelevant, fillDefaults],
      schema: origSchema,
      uiSchema: {},
      extraActions,
    }
  ).then(({ schema, uiSchema, formData }) => {
    let expectedSchema = {
      firstName: { type: "string" },
      lastName: { type: "string" },
    };
    expect(schema.properties.registration).not.toEqual(expectedSchema);
    expect(uiSchema).toEqual({});
    expect(formData).toEqual({
      registration: { firstName: "Barry", lastName: "White", gender: "Male" },
    });
  });
});

test("Opposite rule", () => {
  return runRules(
    { registration: { firstName: "Barry" } },
    {
      rulesEngine,
      rules: [fillDefaults, hideNonRelevant],
      schema: origSchema,
      uiSchema: {},
      extraActions,
    }
  ).then(({ schema, uiSchema, formData }) => {
    expect(schema.properties.registration).toEqual(
      origSchema.properties.registration
    );
    expect(uiSchema).toEqual({});
    expect(formData).toEqual({
      registration: { firstName: "Barry", lastName: "White", gender: "Male" },
    });
  });
});

test("Opposite rule with order", () => {
  return runRules(
    { registration: { firstName: "Barry" } },
    {
      rulesEngine,
      rules: [
        Object.assign({}, hideNonRelevant, { order: 1 }),
        Object.assign({}, fillDefaults, { order: 0 }),
      ],
      schema: origSchema,
      uiSchema: {},
      extraActions,
    }
  ).then(({ schema, uiSchema, formData }) => {
    expect(schema.properties.registration).toEqual(
      origSchema.properties.registration
    );
    expect(uiSchema).toEqual({});
    expect(formData).toEqual({
      registration: { firstName: "Barry", lastName: "White", gender: "Male" },
    });
  });
});
