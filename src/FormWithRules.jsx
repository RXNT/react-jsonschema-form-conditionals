import React, { Component } from "react";
import Form from "react-jsonschema-form";
import PropTypes from "prop-types";
import { actionToFields } from "./conditions";
import deepcopy from "deepcopy";

export default class FormWithRules extends Component {

  constructor(props) {
    super(props);

    let { formData } = this.props;
    this.state = this.updateSchema(formData);
  }

  componentWillReceiveProps(nextProps) {
    let { schema, formData, uiSchema } = nextProps;
    this.setState({ schema, formData, uiSchema });
  }

  updateSchema = (formData = {}) => {
    let rules = this.props.rules;
    let schema = deepcopy(this.props.schema);
    let uiSchema = deepcopy(this.props.uiSchema);

    Object.keys(rules).map((action) => {
      switch (action) {
        case "hide": {
          let actions = actionToFields(rules[action], formData)
          Object.keys(actions).filter((key) => actions[key]).forEach((key) => {
            delete properties[key];
            delete uiSchema[key];
          })
        }
        case "red": {
          let actions = actionToFields(rules[action], formData)
          Object.keys(actions).filter((key) => actions[key]).forEach((key) => {
            if (uiSchema[key] === undefined) uiSchema[key] = {};
            if (uiSchema[key]["classNames"] === undefined) uiSchema[key]["classNames"] = "";
            uiSchema[key]["classNames"] = uiSchema[key]["classNames"] + " red";
          })
        }
      }
    });

    return { schema, uiSchema, formData: Object.assign({}, formData) };
  };

  ruleTracker = (state) => {
    let { formData } = state;
    this.setState(this.updateSchema(formData));
    if (this.props.onChange) this.props.onChange(state);
  };

  render() {
    let configs = Object.assign({}, this.props);

    delete configs.schema;
    delete configs.formData;
    delete configs.onChange;
    delete configs.uiSchema;

    return (
      <div>
          <Form {...configs}
                schema={this.state.schema}
                uiSchema={this.state.uiSchema}
                formData={this.state.formData}
                onChange={this.ruleTracker}
          />
      </div>
    )
  }
}

if (process.env.NODE_ENV !== "production") {
  FormWithRules.propTypes = {
    rules: PropTypes.object.isRequired
  };
}

