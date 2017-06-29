import Executor from "../../src/actions/executor";

let schema = {
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    name: { type: "string" },
  },
};

let executor = new Executor({}, schema);

test("executes single action", () => {
  let singleAction = {
    firstName: [{ action: "remove" }],
    name: [{ action: "require" }],
  };

  return executor.run(singleAction).then(({ schema }) => {
    let expectedSchema = {
      required: ["name"],
      properties: {
        lastName: schema.properties.lastName,
        name: schema.properties.name,
      },
    };
    expect(schema).toEqual(expectedSchema);
  });
});

test("executes multiple actions", () => {
  let multiAction = {
    firstName: [{ action: "remove" }],
    name: [
      { action: "require" },
      {
        action: "replaceUi",
        conf: { classNames: "col-md-5" },
      },
    ],
  };

  return executor.run(multiAction).then(({ schema, uiSchema }) => {
    let expectedSchema = {
      required: ["name"],
      properties: {
        lastName: schema.properties.lastName,
        name: schema.properties.name,
      },
    };
    expect(schema).toEqual(expectedSchema);
    expect(uiSchema).toEqual({ name: { classNames: "col-md-5" } });
  });
});
