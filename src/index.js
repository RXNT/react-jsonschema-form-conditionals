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

      let { schema, uiSchema, formData } = this.props;
      this.state = { schema, uiSchema, formData };

      this.runRulesOnRender = true;
    }

    componentWillReceiveProps(nextProps) {
      let { schema, formData, uiSchema } = nextProps;
      this.setState({ schema, formData, uiSchema });
      this.runRulesOnRender =
        this.runRulesOnRender || !deepEqual(nextProps, this.props);
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

    runRules = formData => {
      let { rulesEngine, rules, schema, uiSchema, extraActions } = this.props;
      let rulesExecutor = new Actions(rules, schema, uiSchema, extraActions);
      console.log("Running rules");
      return rulesEngine.run(formData, rules, schema).then(actions => {
        console.log(`Received actions ${JSON.stringify(actions)}`);
        return rulesExecutor.run(actions);
      });
    };

    ruleTracker = state => {
      let { formData } = state;
      this.runRules(formData).then(newSchemaConf => {
        this.notifySchemaUpdate(newSchemaConf, this.state);
        this.setState(Object.assign({}, newSchemaConf, { formData }));
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
      let { schema, uiSchema, formData } = this.state;
      let configs = Object.assign({}, this.props, {
        schema,
        uiSchema,
        formData,
        onChange: this.ruleTracker,
      });

      if (this.runRulesOnRender) {
        this.runRulesOnRender = false;
        let self = this;
        this.runRules(this.state.formData).then(newState =>
          self.setState(newState)
        );
      }

      return <FormComponent {...configs} />;
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
