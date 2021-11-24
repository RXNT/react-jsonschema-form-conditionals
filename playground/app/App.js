import React from "react";
import Form from "@rjsf/core";
import applyRules from "../../src/applyRules";
import conf from "./conf";

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
