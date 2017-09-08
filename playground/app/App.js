import React from "react";
import Form from "react-jsonschema-form";
import applyRules from "../../src/applyRules";
import conf from "./conf";

let FormToDisplay = applyRules(Form);

export default function() {
  return <FormToDisplay {...conf} />;
}
