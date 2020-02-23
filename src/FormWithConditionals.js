import React, { Component } from "react";
import PropTypes from "prop-types";
import Form from "react-jsonschema-form";
import { deepEquals } from "react-jsonschema-form/lib/utils";
import { isDevelopment, toError } from "./utils";
import rulesRunner from "./rulesRunner";

import { DEFAULT_ACTIONS } from "./actions";
import validateAction from "./actions/validateAction";

export default class FormWithConditionals extends Component {
  static foo = "hello";
  static propTypes = {
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
    validateSchema: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.updateConf = this.updateConf.bind(this);
    let {
      formData = {},
      formContext = {},
      schema,
      uiSchema,
      rules,
      Engine,
      extraActions = {},
      validateSchema,
    } = this.props;

    if (isDevelopment()) {
      rules
        .reduce((agg, { event }) => agg.concat(event), [])
        .forEach(({ type, params } = {}) => {
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

    this.runRules = rulesRunner(
      schema,
      uiSchema,
      rules,
      Engine,
      extraActions,
      validateSchema
    );
    this.shouldUpdate = false;
    this.state = { schema, uiSchema };
    this.updateConf(formData, formContext);
  }

  componentWillReceiveProps(nextProps) {
    let formDataChanged =
      nextProps.formData && !deepEquals(nextProps.formData, this.formData);
    let formContextChanged =
      nextProps.formContext &&
      !deepEquals(nextProps.formContext, this.formContext);

    if (formDataChanged || formContextChanged) {
      this.updateConf(nextProps.formData, nextProps.formContext);
      this.shouldUpdate = true;
    } else {
      this.shouldUpdate =
        this.shouldUpdate ||
        !deepEquals(
          nextProps,
          Object.assign({}, this.props, {
            formData: nextProps.formData,
          })
        );
    }
  }

  updateConf(formData, formContext) {
    this.formData = formData;
    this.formContext = formContext;
    return this.runRules(formData, formContext).then(conf => {
      let dataChanged = !deepEquals(this.formData, conf.formData);
      this.formData = conf.formData;

      let newState = { schema: conf.schema, uiSchema: conf.uiSchema };
      let confChanged = !deepEquals(newState, this.state);
      if (dataChanged || confChanged) {
        this.shouldUpdate = true;
        this.setState(newState);
      }

      return conf;
    });
  }

  handleChange(change) {
    let { formData } = change;
    let updTask = this.updateConf(formData, this.props.formContext);

    let { onChange } = this.props;
    if (onChange) {
      updTask.then(conf => {
        let updChange = Object.assign({}, change, conf);
        onChange(updChange);
      });
    }
  }

  shouldComponentUpdate() {
    if (this.shouldUpdate) {
      this.shouldUpdate = false;
      return true;
    }
    return false;
  }

  render() {
    // Assignment order is important
    let formConf = Object.assign({}, this.props, this.state, {
      onChange: this.handleChange,
      formData: this.formData,
    });
    const { FormComponent = Form } = this.props;
    return <FormComponent {...formConf} />;
  }
}
