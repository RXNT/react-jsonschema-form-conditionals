import React, { Component } from "react";
import PropTypes from "prop-types";
import Actions from "./actions";
import Engine from "./engine";
import deepEqual from "deep-equal";
import { isDevelopment } from "./utils";

export default function applyRules(FormComponent) {
  class FormWithConditionals extends Component {
    constructor(props) {
      super(props);

      this.rulesEngine = new Engine();
      this.rulesExecutor = new Actions(
        this.props.rules,
        this.props.schema,
        this.props.uiSchema,
        this.props.extraActions
      );

      let { schema, uiSchema, formData } = this.props;
      this.state = { schema, uiSchema, formData };

      let self = this;
      this.rulesEngine
        .run(formData)
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
      this.rulesEngine
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
