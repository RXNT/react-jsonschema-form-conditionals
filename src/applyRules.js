import React, { Component } from "react";
import PropTypes from "prop-types";
import { toError } from "./utils";
import rulesRunner from "./rulesRunner";

import { DEFAULT_ACTIONS } from "./actions";
import validateAction from "./actions/validateAction";
import env from "./env";

const { utils } = require("@rjsf/core");
const { deepEquals } = utils;

export default function applyRules(
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
              type: PropTypes.string.isRequired,
            }),
            PropTypes.arrayOf(
              PropTypes.shape({
                type: PropTypes.string.isRequired,
              })
            ),
          ]),
        })
      ).isRequired,
      extraActions: PropTypes.object,
    };

    PropTypes.checkPropTypes(
      propTypes,
      { rules, Engine, extraActions },
      "props",
      "rjsf-conditionals"
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
  const DEFAULT_FORM_DATA = {};

  return (FormComponent) => {
    class FormWithConditionals extends Component {
      constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.updateConf = this.updateConf.bind(this);
        this.state = {
          schema: schema,
          uiSchema: uiSchema,
          formData: DEFAULT_FORM_DATA,
        };
        this.updateConfigPromiseChain = null;
      }

      /**
       * Evaluate rules when mounted
       */
      componentDidMount() {
        this.updateConf(this.props.formData || DEFAULT_FORM_DATA);
      }

      /**
       * Re-evaluate rules when form data prop changes
       * schema and uiSchema is not taken into account
       */
      componentDidUpdate(prevProps, prevState, snapshot) {
        const prevData = prevProps.formData || DEFAULT_FORM_DATA;
        const newData = this.props.formData || DEFAULT_FORM_DATA;
        if (!deepEquals(prevData, newData)) {
          this.updateConf(newData);
        }
      }

      /**
       * Evaluate rules with given form data
       * which in turn can mutate schema, uiSchema, formData
       *
       * Run every update in sequence after previous promise
       * finishes
       *
       * @param formData {Object}
       * @param [changeHandler] {Function}
       * @return {Promise<Object>}
       */
      updateConf(formData, changeHandler) {
        const rulesRunnerHandler = (newValues) => {
          if (!deepEquals(newValues, this.state)) {
            this.setState(newValues);
          }
          changeHandler && changeHandler(newValues);
          return newValues;
        };

        if (this.updateConfigPromiseChain === null) {
          // if no updates in progress
          this.updateConfigPromiseChain = runRules(formData)
            .then((newValues) => rulesRunnerHandler(newValues))
            // clear promise chain when all finish
            .finally(() => (this.updateConfigPromiseChain = null));
        } else {
          // wait for rest of promises to finish
          this.updateConfigPromiseChain.then((valuesFromPrevRunner) => {
            // double check if necessary to run again
            if (!deepEquals(valuesFromPrevRunner.formData, formData)) {
              return runRules(formData).then((newValues) =>
                rulesRunnerHandler(newValues)
              );
            } else {
              // otherwise invoke change handler
              // and return previous result
              changeHandler && changeHandler(valuesFromPrevRunner);
              return valuesFromPrevRunner;
            }
          });
        }

        return this.updateConfigPromiseChain;
      }

      /**
       * Evaluate form data changes after user input
       * https://react-jsonschema-form.readthedocs.io/en/latest/#form-data-changes
       * @param formChange {Object}
       */
      handleChange(formChange) {
        const { formData } = formChange;
        const { onChange } = this.props;
        if (!deepEquals(formData, this.state.formData)) {
          this.updateConf(formData, (newValues) => {
            if (onChange) {
              let updChange = Object.assign({}, formChange, newValues);
              onChange(updChange);
            }
          });
        } else {
          onChange && onChange(formChange);
        }
      }

      render() {
        // Assignment order is important
        let formConf = Object.assign({}, this.props, this.state, {
          onChange: this.handleChange,
        });
        return <FormComponent {...formConf} />;
      }
    }

    return FormWithConditionals;
  };
}
