import React, { Component } from "react";
import PropTypes from "prop-types";
import Actions from "./actions";
import PredicatesRuleEngine from "./engine/PredicatesRuleEngine";
import deepEqual from "deep-equal";
import { isDevelopment } from "./utils";

export default function applyRules(FormComponent) {
  class FormWithConditionals extends Component {
    constructor(props) {
      super(props);

      let { schema, rules, uiSchema, formData, extraActions } = this.props;

      this.rulesExecutor = new Actions(rules, schema, uiSchema, extraActions);
      this.state = { schema, uiSchema, formData };

      let self = this;
      this.props.rulesEngine
        .run(formData, rules, schema)
        .then(this.rulesExecutor.run)
        .then(newState => {
          self.setState(newState);
        });
    }

    componentWillReceiveProps(nextProps) {
      let { schema, formData, uiSchema } = nextProps;
      this.setState({ schema, formData, uiSchema });
    }

    shouldComponentUpdate(nextProps, nextState) {
      if (!deepEqual(nextState.schema, this.state.schema)) {
        return true;
      }
      if (!deepEqual(nextState.uiSchema, this.state.uiSchema)) {
        return true;
      }
      return !deepEqual(nextProps, this.props);
    }

    ruleTracker = state => {
      let { formData } = state;
      this.props.rulesEngine
        .run(formData, this.props.rules, this.props.schema)
        .then(this.rulesExecutor.run)
        .then(newSchemaConf => {
          this.notifySchemaUpdate(newSchemaConf, this.state);
          this.setState(Object.assign(newSchemaConf, { formData }));
          if (this.props.onChange) {
            this.props.onChange(Object.assign({}, state, newSchemaConf));
          }
        });
    };

    notifySchemaUpdate = (nextSchemaConf, schemaConf) => {
      if (this.props.onSchemaConfChange === undefined) {
        return;
      }

      let schemaChanged =
        !deepEqual(nextSchemaConf.schema, schemaConf.schema) ||
        !deepEqual(nextSchemaConf.uiSchema, schemaConf.uiSchema);

      if (schemaChanged) {
        this.props.onSchemaConfChange(nextSchemaConf, schemaConf);
      }
    };

    render() {
      let configs = Object.assign({}, this.props);

      delete configs.schema;
      delete configs.formData;
      delete configs.onChange;
      delete configs.uiSchema;

      this.props.rulesEngine.validate(this.props.rules, this.props.schema);

      return (
        <FormComponent
          {...configs}
          schema={this.state.schema}
          uiSchema={this.state.uiSchema}
          formData={this.state.formData}
          onChange={this.ruleTracker}
        />
      );
    }
  }

  FormWithConditionals.defaultProps = {
    rulesEngine: PredicatesRuleEngine,
  };

  if (isDevelopment()) {
    FormWithConditionals.propTypes = {
      rules: PropTypes.arrayOf(
        PropTypes.shape({
          conditions: PropTypes.object.isRequired,
          event: PropTypes.shape({
            type: PropTypes.string.isRequired,
          }),
        })
      ).isRequired,
      onSchemaConfChange: PropTypes.func,
      extraActions: PropTypes.object,
    };
  }

  return FormWithConditionals;
}
