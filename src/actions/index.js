import deepcopy from "deepcopy";
import validate from "./validation";

import remove from "./remove";
import require from "./require";
import replaceUi from "./replaceUi";

export default class Actions {
  constructor(rules, schema, uiSchema, extraActions) {
    this.rules = rules;
    this.schema = schema;
    this.uiSchema = uiSchema;

    this.allActions = Object.assign(
      {},
      { remove, require, replaceUi },
      extraActions
    );

    if (process.env.NODE_ENV !== "production") {
      validate(rules, this.allActions);
    }
  }

  run = actions => {
    let initialValue = {
      schema: deepcopy(this.schema),
      uiSchema: deepcopy(this.uiSchema),
    };

    let { schema, uiSchema } = Object.keys(
      actions
    ).reduce(({ schema, uiSchema }, field) => {
      let fieldActions = actions[field];
      return fieldActions.reduce(
        ({ schema, uiSchema }, { action, conf }) => {
          let executor = this.allActions[action];
          return executor(field, schema, uiSchema, conf);
        },
        { schema, uiSchema }
      );
    }, initialValue);

    return new Promise(function(resolve) {
      resolve({ schema, uiSchema });
    });
  };
}
