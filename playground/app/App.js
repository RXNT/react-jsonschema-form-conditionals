import React, { Component } from "react";
import applyRules from "../../src/index";
import Form from "react-jsonschema-form";
import { JsonEditor, JSEditor, Viewer } from "./Editor";
import Selector from "./Selector";
import samples from "./samples";

let FormWithConditionals = applyRules(Form);
const toJson = val => JSON.stringify(val, null, 2);

const liveValidateSchema = { type: "boolean", title: "Live validation" };

export class App extends Component {
  constructor(props) {
    super(props);
    // initialize state with Simple data sample
    const { schema, uiSchema, formData, rules, extraActions } = samples.Simple;
    this.state = {
      schema,
      uiSchema,
      formData,
      extraActions,
      rules,
      conf: { schema, uiSchema },
      liveValidate: false,
    };
  }

  onRulesEdited = rules => this.setState({ rules });

  onSchemaEdited = schema => this.setState({ schema });

  onUISchemaEdited = uiSchema => this.setState({ uiSchema });

  onFormDataEdited = formData => this.setState({ formData });

  onFormDataChange = ({ formData }) => this.setState({ formData });

  onSchemaConfChange = conf => this.setState({ conf });

  onExtraActionsChange = extraActions => this.setState({ extraActions });

  setLiveValidate = ({ formData }) => this.setState({ liveValidate: formData });

  load = data => {
    this.setState({ form: false }, _ => this.setState({ ...data, form: true }));
  };

  render() {
    const {
      schema,
      uiSchema,
      formData,
      rules,
      extraActions,
      liveValidate,
      conf,
    } = this.state;

    return (
      <div className="container-fluid">
        <div className="page-header">
          <h1>react-jsonschema-form</h1>
          <div className="row">
            <div className="col-sm-8">
              <Selector onSelected={this.load} />
            </div>
            <div className="col-sm-2">
              <Form
                schema={liveValidateSchema}
                formData={liveValidate}
                onChange={this.setLiveValidate}>
                <div />
              </Form>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <FormWithConditionals
              onSchemaConfChange={this.onSchemaConfChange}
              onChange={this.onFormDataChange}
              rules={rules}
              extraActions={extraActions}
              liveValidate={liveValidate}
              safeRenderCompletion={true}
              noHtml5Validate={true}
              formData={formData}
              schema={schema}
              uiSchema={uiSchema}>
              <div />
            </FormWithConditionals>
          </div>
          <div className="col-md-3">
            <Viewer
              title="Conditionals schema"
              theme="default"
              code={toJson(conf.schema)}
            />
          </div>
          <div className="col-md-3">
            <Viewer
              title="Conditionals uiSchema"
              theme="default"
              code={toJson(conf.uiSchema)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <JsonEditor
              title="JSONSchema"
              theme="default"
              code={toJson(schema)}
              onChange={this.onSchemaEdited}
            />
          </div>
          <div className="col-sm-6">
            <JsonEditor
              title="Rules"
              theme="default"
              code={toJson(rules)}
              onChange={this.onRulesEdited}
            />
          </div>
          <div className="row">
            <div className="col-sm-6">
              <JsonEditor
                title="UISchema"
                theme="default"
                code={toJson(uiSchema)}
                onChange={this.onUISchemaEdited}
              />
            </div>
            <div className="col-sm-6">
              <JsonEditor
                title="formData"
                theme="default"
                code={toJson(formData)}
                onChange={this.onFormDataEdited}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <JSEditor
                title="Extra Actions"
                theme="default"
                code={extraActions}
                onChange={this.onExtraActionsChange}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
