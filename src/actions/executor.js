import { isDevelopment } from "../utils";
import deepcopy from "deepcopy";
import validate from "./validation";

import remove from "./remove";
import require from "./require";
import replaceUi from "./replaceUi";
import appendClass from "./appendClass";

export default class Executor {
  constructor(rules, schema, uiSchema = {}, extraActions) {
    this.rules = rules;
    this.schema = schema;
    this.uiSchema = uiSchema;

    this.allActions = Object.assign(
      {},
      { remove, require, replaceUi, appendClass },
      extraActions
    );

    if (isDevelopment()) {
      validate(rules, this.allActions, schema, uiSchema);
    }
  }

  run = (actions, formData) => {
    let schema = deepcopy(this.schema);
    let uiSchema = deepcopy(this.uiSchema);
    formData = deepcopy(formData);

    actions.forEach(({ type, params }) => {
      let executor = this.allActions[type];
      executor(params, schema, uiSchema, formData);
    });

    return Promise.resolve({ schema, uiSchema, formData });
  };
}
