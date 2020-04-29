import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toError } from './utils';
import rulesRunner from './rulesRunner';

import { DEFAULT_ACTIONS } from './actions';
import validateAction from './actions/validateAction';
import env from './env';

const { utils } = require('@rjsf/core');
const { deepEquals } = utils;

export default function applyRules (
  schema,
  uiSchema,
  rules,
  Engine,
  extraActions = {}
) {
  if (env.isDevelopment()) {
    const propTypes = {
      Engine: PropTypes.func.isRequired,
      rules: PropTypes.arrayOf(
        PropTypes.shape({
          conditions: PropTypes.object.isRequired,
          order: PropTypes.number,
          event: PropTypes.oneOfType([
            PropTypes.shape({
              type: PropTypes.string.isRequired
            }),
            PropTypes.arrayOf(
              PropTypes.shape({
                type: PropTypes.string.isRequired
              })
            )
          ])
        })
      ).isRequired,
      extraActions: PropTypes.object
    };

    PropTypes.checkPropTypes(
      propTypes,
      { rules, Engine, extraActions },
      'props',
      'rjsf-conditionals'
    );

    rules
      .reduce((agg, { event }) => agg.concat(event), [])
      .forEach(({ type, params }) => {
        // Find associated action
        let action = extraActions[type]
          ? extraActions[type]
          : DEFAULT_ACTIONS[type];
        if (action === undefined) {
          toError(`Rule contains invalid action "${type}"`);
          return;
        }

        validateAction(action, params, schema, uiSchema);
      });
  }

  const runRules = rulesRunner(schema, uiSchema, rules, Engine, extraActions);

  return (FormComponent) => {
    class FormWithConditionals extends Component {
      constructor (props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.updateConf = this.updateConf.bind(this);
        this.state = { schema: schema, uiSchema: uiSchema, formData: {} };
      }

      componentDidMount () {
        this.updateConf(this.props.formData || {});
      }

      componentDidUpdate (prevProps, prevState, snapshot) {
        const prevData = prevProps.formData || {};
        const newData = this.props.formData || {};
        if (!deepEquals(prevData, newData)) {
          this.updateConf(newData);
        }
      }

      updateConf (formData) {
        return runRules(formData).then((conf) => {
          let newState = { schema: conf.schema, uiSchema: conf.uiSchema, formData: conf.formData };
          if (!deepEquals(newState, this.state)) {
            this.setState(newState);
          }
          return conf;
        });
      }

      handleChange (change) {
        let { formData } = change;
        let { onChange } = this.props;
        if (!deepEquals(formData, this.state.formData)) {
          this.setState(this.state.formData);
          let updTask = this.updateConf(formData);
          if (onChange) {
            updTask.then((conf) => {
              let updChange = Object.assign({}, change, conf);
              onChange(updChange);
            });
          }
        } else {
          onChange && onChange(change);
        }
      }

      render () {
        // Assignment order is important
        let formConf = Object.assign({}, this.props, this.state, {
          onChange: this.handleChange
        });
        return <FormComponent {...formConf} />;
      }
    }

    return FormWithConditionals;
  };
}
