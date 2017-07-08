import React, { Component } from "react";
import applyRules from "../../src/index";
import PredicatesRuleEngine from "../../src/engine/SimplifiedRuleEngineFactory";
import CacheControlRulesEngine from "../../src/engine/CacheControlEngineFactory";
import Form from "react-jsonschema-form";
import { JsonEditor, Viewer } from "./Editor";
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

    let Header = (
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
    );

    let CurrentViews = (
      <div className="row">
        <div className="col-md-6">
          <FormWithConditionals
            onSchemaConfChange={this.onSchemaConfChange}
            onChange={this.onFormDataChange}
            rules={rules}
            rulesEngine={
              this.props.rulesEngine === "cache"
                ? CacheControlRulesEngine
                : PredicatesRuleEngine
            }
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
          <Viewer title="Conditionals schema" code={toJson(conf.schema)} />
        </div>
        <div className="col-md-3">
          <Viewer title="Conditionals uiSchema" code={toJson(conf.uiSchema)} />
        </div>
      </div>
    );

    let JsonEditors = (
      <div>
        <div className="row">
          <div className="col-sm-6">
            <JsonEditor
              title="JSONSchema"
              code={toJson(schema)}
              onChange={this.onSchemaEdited}
            />
          </div>
          <div className="col-sm-6">
            <JsonEditor
              title="Rules"
              code={toJson(rules)}
              onChange={this.onRulesEdited}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <JsonEditor
              title="UISchema"
              code={toJson(uiSchema)}
              onChange={this.onUISchemaEdited}
            />
          </div>
          <div className="col-sm-6">
            <JsonEditor
              title="formData"
              code={toJson(formData)}
              onChange={this.onFormDataEdited}
            />
          </div>
        </div>
      </div>
    );

    return (
      <div className="container-fluid">
        {Header}
        {CurrentViews}
        {JsonEditors}
      </div>
    );
  }
}
