import toAction from "./actions";
import deepcopy from "deepcopy";

function toExecutor(predicate, action) {
  return (schema, uiSchema, formData) => {
    predicate.run(formData).then(events => {
      events.forEach(({ params }) =>
        action(params, schema, uiSchema, formData)
      );
      return { schema, uiSchema, formData };
    });
  };
}

export default function runRules(
  formData = {},
  { rulesEngine, rules, schema, uiSchema = {}, extraActions = {} }
) {
  let ruleExecutors = rules.map(rule => {
    let predicate = rulesEngine.getEngine([rule], schema);
    let action = toAction(rule, schema, uiSchema, extraActions);
    return toExecutor(predicate, action);
  });

  let schemaCopy = deepcopy(schema);
  let uiSchemaCopy = deepcopy(uiSchema);
  let formDataCopy = deepcopy(formData);

  let execute = ruleExecutors.reduce(
    (agg, executor) =>
      agg.then(() => executor(schemaCopy, uiSchemaCopy, formDataCopy)),
    Promise.resolve({})
  );
  return execute.then(() => {
    return {
      schema: schemaCopy,
      uiSchema: uiSchemaCopy,
      formData: formDataCopy,
    };
  });
}
