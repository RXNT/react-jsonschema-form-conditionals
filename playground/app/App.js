import React from "react";
import Form from "react-jsonschema-form";
import applyRules from "../../src/applyRules";
import conf from "./conf/simpleSum";

let { schema, uiSchema, rules, rulesEngine, extraActions, formData } = conf;

let FormToDisplay = applyRules(
  schema,
  uiSchema,
  rules,
  rulesEngine,
  extraActions
)(Form);

export default function() {
  return <FormToDisplay formData={formData} />;
}
