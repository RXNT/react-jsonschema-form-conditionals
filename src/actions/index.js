import { isDevelopment, toError } from "../utils";
import validateAction from "./validateAction";

import remove from "./remove";
import require from "./require";
import uiAppend from "./uiAppend";
import uiReplace from "./uiReplace";
import uiOverride from "./uiOverride";

const DEFAULT_ACTIONS = {
  remove,
  require,
  uiAppend,
  uiReplace,
  uiOverride,
};

export default function execute(
  { type, params },
  schema,
  uiSchema,
  formData,
  extraActions = {}
) {
  let action = extraActions[type] ? extraActions[type] : DEFAULT_ACTIONS[type];
  if (isDevelopment()) {
    validateAction(action, params, schema, uiSchema);
  }
  if (action === undefined) {
    toError(`Rule contains invalid action "${type}"`);
    return;
  }
  action(params, schema, uiSchema, formData);
}
