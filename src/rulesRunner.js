import execute from "./actions";
import deepcopy from "deepcopy";
import deepEqual from "deep-equal";

function doRunRules(
  engine,
  formData,
  schema,
  uiSchema = {},
  extraActions = {}
) {
  let schemaCopy = deepcopy(schema);
  let uiSchemaCopy = deepcopy(uiSchema);
  let formDataCopy = deepcopy(formData);

  let res = engine.run(formData).then(events => {
    events.forEach(event =>
      execute(event, formDataCopy, schemaCopy, uiSchemaCopy, extraActions)
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
      if (b.order !== undefined) {
        return 1;
      } else {
        return 0;
      }
    }
    if (b.order === undefined) {
      return -1;
    }
    return a.order - b.order;
  });
}

export default function rulesRunner(
  schema,
  uiSchema,
  rules,
  Engine,
  extraActions
) {
  let engine = new Engine([], schema);
  normRules(rules).forEach(rule => engine.addRule(rule));

  return formData => {
    if (formData === undefined || formData === null) {
      return Promise.resolve({ schema, uiSchema, formData });
    }

    return doRunRules(
      engine,
      formData,
      schema,
      uiSchema,
      extraActions
    ).then(conf => {
      if (deepEqual(conf.formData, formData)) {
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
    });
  };
}
