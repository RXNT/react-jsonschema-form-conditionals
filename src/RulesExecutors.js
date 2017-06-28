import deepcopy from "deepcopy";
import validate from "./actions/validation";

export default class RulesExecutors {
  constructor(rules, schema, uiSchema) {
    this.rules = rules;
    this.schema = schema;
    this.uiSchema = uiSchema;

    if (process.env.NODE_ENV !== "production") {
      validate(rules, this);
    }
  }

  remove = (field, schema, uiSchema) => {
    delete schema.properties[field];
    delete uiSchema[field];
    return { schema, uiSchema };
  };

  require = (field, schema, uiSchema) => {
    if (!schema.required) {
      schema.required = [];
    }
    schema.required.push(field);
    return { schema, uiSchema };
  };

  "ui:replace" = (field, schema, uiSchema, conf) => {
    uiSchema[field] = conf;
    return { schema, uiSchema };
  };

  run(actions) {
    let initialValue = {
      schema: deepcopy(this.schema),
      uiSchema: deepcopy(this.uiSchema)
    };

    let executors = this;

    return new Promise(function(resolve) {
      let { schema, uiSchema } = Object.keys(actions).reduce(({ schema, uiSchema }, field) => {
        let fieldActions = actions[field];
        return fieldActions.reduce(({ schema, uiSchema }, { action, conf }) => {
          let executor = executors[action];
          return executor(field, schema, uiSchema, conf);
        }, { schema, uiSchema });
      }, initialValue);

      resolve({ schema, uiSchema });
    });
  }
}
