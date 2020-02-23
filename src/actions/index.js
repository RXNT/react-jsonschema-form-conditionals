import remove from "./remove";
import require from "./require";
import uiAppend from "./uiAppend";
import uiReplace from "./uiReplace";
import uiOverride from "./uiOverride";

export const DEFAULT_ACTIONS = {
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
  formContext,
  extraActions = {}
) {
  let action = extraActions[type] ? extraActions[type] : DEFAULT_ACTIONS[type];
  action(params, schema, uiSchema, formData, formContext);
}
