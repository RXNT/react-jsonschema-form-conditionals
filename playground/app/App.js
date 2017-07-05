import React, { Component } from "react";
import applyRules from "../../src/index";
import Form from "react-jsonschema-form";
import Editor from "./Editor";
import Selector from "./Selector";
import samples from "./samples";

let extraActions = {
  enlarge: function(field, schema, uiSchema) {
    uiSchema[field].classNames = "col-md-8";
    return { schema, uiSchema };
  },
};

let FormWithConditionals = applyRules(Form);
const toJson = val => JSON.stringify(val, null, 2);

export class App extends Component {
  constructor(props) {
    super(props);
    // initialize state with Simple data sample
    const { schema, uiSchema, formData, rules } = samples.Simple;
    this.state = {
      schema,
      uiSchema,
      formData,
      rules,
      liveValidate: true,
    };
  }

  onRulesEdited = rules => this.setState({ rules });

  onSchemaEdited = schema => this.setState({ schema });

  onUISchemaEdited = uiSchema => this.setState({ uiSchema });

  onFormDataEdited = formData => this.setState({ formData });

  load = data => {
    this.setState({ form: false }, _ => this.setState({ ...data, form: true }));
  };

  render() {
    const { schema, uiSchema, formData, rules } = this.state;

    return (
      <div className="container">
        <div className="col-sm-8">
          <Selector onSelected={this.load} />
        </div>
        <div className="col-sm-5">
          <FormWithConditionals
            onSchemaConfChange={nextSchemaConf =>
              console.log(
                `Conf changed ${JSON.stringify(nextSchemaConf.schema)}`
              )}
            rules={rules}
            extraActions={extraActions}
            liveValidate={false}
            safeRenderCompletion={true}
            noHtml5Validate={true}
            formData={formData}
            schema={schema}
            uiSchema={uiSchema}
          />
        </div>
        <div className="col-sm-7">
          <div className="row">
            <div className="col-sm-6">
              <Editor
                title="JSONSchema"
                theme="default"
                code={toJson(schema)}
                onChange={this.onSchemaEdited}
              />
            </div>
            <div className="col-sm-6">
              <Editor
                title="Rules"
                theme="default"
                code={toJson(rules)}
                onChange={this.onRulesEdited}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <Editor
                title="UISchema"
                theme="default"
                code={toJson(uiSchema)}
                onChange={this.onUISchemaEdited}
              />
            </div>
            <div className="col-sm-6">
              <Editor
                title="formData"
                theme="default"
                code={toJson(formData)}
                onChange={this.onFormDataEdited}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
