import execute from "./actions";
import deepcopy from "deepcopy";
import { deepEquals } from "@rjsf/core/lib/utils";

function doRunRules(engine, formData, schema, uiSchema, extraActions = {}) {
  let schemaCopy = deepcopy(schema);
  let uiSchemaCopy = deepcopy(uiSchema);
  let formDataCopy = deepcopy(formData);

  let res = engine.run(formData).then(events => {
    events.forEach(event =>
      execute(event, schemaCopy, uiSchemaCopy, formDataCopy, extraActions)
    );
  });

  return res.then(() => {
    return {
      schema: schemaCopy,
      uiSchema: uiSchemaCopy,
      formData: formDataCopy,
    };
  });
}

export function normRules(rules) {
  return rules.sort(function(a, b) {
    if (a.order === undefined) {
      return b.order === undefined ? 0 : 1;
    }
    return b.order === undefined ? -1 : a.order - b.order;
  });
}

export default function rulesRunner(
  schema,
  uiSchema,
  rules,
  engine,
  extraActions
) {
  engine = typeof engine === "function" ? new engine([], schema) : engine;
  normRules(rules).forEach(rule => engine.addRule(rule));

  return formData => {
    if (formData === undefined || formData === null) {
      return Promise.resolve({ schema, uiSchema, formData });
    }

    return doRunRules(engine, formData, schema, uiSchema, extraActions).then(
      conf => {
        if (deepEquals(conf.formData, formData)) {
          return conf;
        } else {
          return doRunRules(
            engine,
            conf.formData,
            schema,
            uiSchema,
            extraActions
          );
        }
      }
    );
  };
}
