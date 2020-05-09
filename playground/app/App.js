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

export default function () {
  const [values, setValues] = React.useState(formData);

  const handleSubmit = () => window.alert("on submit");
  const handleChange = (changeEvent) => {
    setValues(changeEvent.formData);
    console.log("on change:", changeEvent);
  };
  const handleError = (errors) => console.log("errors:", errors);

  return (
    <>
      <nav className="navbar navbar-expand navbar-dark bg-primary fixed-top">
        <a className="navbar-brand" href="#">
          rjsf-conditionals
        </a>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a
              className="nav-link"
              href="https://github.com/ivarprudnikov/rjsf-conditionals">
              Github repository
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              href="https://github.com/ivarprudnikov/rjsf-conditionals/blob/master/README.md">
              Docs
            </a>
          </li>
        </ul>
      </nav>

      <div className="container mt-5 py-5">
        <div className="row">
          <div className="col-6">
            <p className="lead">
              Some of the fields here are conditional. Change values to see
              effects.
            </p>
            <FormToDisplay
              formData={formData}
              onSubmit={handleSubmit}
              onChange={handleChange}
              onError={handleError}
              showErrorList={true}
            />
          </div>

          <div className="col-6">
            <h4>Rules</h4>
            <pre
              className="bg-dark text-light p-3 small"
              style={{ maxHeight: 200 }}>
              {JSON.stringify(rules, null, 2)}
            </pre>

            <h4>Schema</h4>
            <pre
              className="bg-dark text-light p-3 small"
              style={{ maxHeight: 200 }}>
              {JSON.stringify(schema, null, 2)}
            </pre>

            <h4>UI Schema</h4>
            <pre
              className="bg-dark text-light p-3 small"
              style={{ maxHeight: 200 }}>
              {JSON.stringify(uiSchema, null, 2)}
            </pre>

            <h4>Form values</h4>
            <pre
              className="bg-dark text-light p-3 small"
              style={{ maxHeight: 200 }}>
              {JSON.stringify(values, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-light py-5">
        <div className="container ">
          <ul className="nav">
            <li className="nav-item">
              <a
                className="nav-link"
                href="https://github.com/ivarprudnikov/rjsf-conditionals">
                Source code / Github repository
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="https://github.com/ivarprudnikov/rjsf-conditionals/blob/master/README.md">
                Docs
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="https://github.com/rjsf-team/react-jsonschema-form">
                Depends on React JSON Schema Form
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
