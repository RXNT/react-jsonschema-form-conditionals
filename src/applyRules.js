import React from "react";
import FormWithConditionals from "./FormWithConditionals";

export default function applyRules(
  schema,
  uiSchema,
  rules,
  Engine,
  extraActions = {}
) {
  return FormComponent => props => (
    <FormWithConditionals
      {...props}
      {...{
        schema,
        uiSchema,
        rules,
        Engine,
        extraActions,
        FormComponent,
      }}
    />
  );
}
