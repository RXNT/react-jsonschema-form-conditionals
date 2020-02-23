import execute from "./actions";
import deepcopy from "deepcopy";
import { deepEquals } from "react-jsonschema-form/lib/utils";

function doRunRules(
  engine,
  formData,
  schema,
  uiSchema,
  formContext,
  extraActions = {}
) {
  let schemaCopy = deepcopy(schema);
  let uiSchemaCopy = deepcopy(uiSchema);
  let formDataCopy = deepcopy(formData);
  let formContextCopy = deepcopy(formContext);

  let res = engine.run({ ...formData, formContext }).then(events => {
    events.forEach(event =>
      execute(
        event,
        schemaCopy,
        uiSchemaCopy,
        formDataCopy,
        formContextCopy,
        extraActions
      )
    );
  });

  return res.then(() => {
    return {
      schema: schemaCopy,
      uiSchema: uiSchemaCopy,
      formData: formDataCopy,
      formContext: formContextCopy,
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
  extraActions,
  validateSchema = true
) {
  const schemaWithFormContext = deepcopy(schema);
  schemaWithFormContext.properties.formContext = { type: "object" };
  engine =
    typeof engine === "function"
      ? new engine([], validateSchema ? schemaWithFormContext : undefined)
      : engine;
  normRules(rules).forEach(rule => engine.addRule(rule));

  return (formData, formContext) => {
    if (formData == null && formContext == null) {
      return Promise.resolve({ schema, uiSchema, formData, formContext });
    }

    return doRunRules(
      engine,
      formData,
      schema,
      uiSchema,
      formContext,
      extraActions
    ).then(conf => {
      if (
        deepEquals(conf.formData, formData) &&
        deepEquals(conf.formContext, formContext)
      ) {
        return conf;
      } else {
        return doRunRules(
          engine,
          conf.formData,
          schema,
          uiSchema,
          formContext,
          extraActions
        );
      }
    });
  };
}
