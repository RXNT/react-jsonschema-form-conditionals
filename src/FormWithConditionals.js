import React, { Component } from "react";
import Form from "react-jsonschema-form";
import PropTypes from "prop-types";
import { fieldToActions } from "./Conditionals";
import executors from "./Actions";
import deepcopy from "deepcopy";

export class FormWithConditionals extends Component {

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
    let actions = fieldToActions(rules, formData);
    let initialValue = {
      schema: deepcopy(this.props.schema),
      uiSchema: deepcopy(this.props.uiSchema)
    };

    let { schema, uiSchema } = Object.keys(actions).
      reduce(({ schema, uiSchema }, field) => {
        let fieldActions = actions[field];
        return fieldActions.reduce(({ schema, uiSchema }, { action, conf }) => {
          let executor = executors[action];
          return executor(field, schema, uiSchema, conf);
        }, { schema, uiSchema });
      }, initialValue);

    return { schema, uiSchema, formData: Object.assign({}, formData) };
  };

  ruleTracker = (state) => {
    let { formData } = state;
    this.setState(this.updateSchema(formData));
    if (this.props.onChange) {
      this.props.onChange(state);
    }
  };

  render() {
    let configs = Object.assign({}, this.props);

    delete configs.schema;
    delete configs.formData;
    delete configs.onChange;
    delete configs.uiSchema;

    return (
      <Form {...configs}
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            onChange={this.ruleTracker}
      />
    );
  }
}

if (process.env.NODE_ENV !== "production") {
  FormWithConditionals.propTypes = {
    rules: PropTypes.object.isRequired
  };
}

