import React, { Component } from "react";
import PropTypes from "prop-types";
import { deepEquals } from "react-jsonschema-form/lib/utils";
import { isDevelopment } from "./utils";
import rulesRunner from "./rulesRunner";

export default function applyRules(
  schema,
  uiSchema,
  rules,
  Engine,
  extraActions = {}
) {
  if (isDevelopment()) {
    const propTypes = {
      Engine: PropTypes.func.isRequired,
      rules: PropTypes.arrayOf(
        PropTypes.shape({
          conditions: PropTypes.object.isRequired,
          order: PropTypes.number,
          event: PropTypes.shape({
            type: PropTypes.string.isRequired,
          }),
        })
      ).isRequired,
      extraActions: PropTypes.object,
    };

    PropTypes.checkPropTypes(
      propTypes,
      { rules, Engine, extraActions },
      "props",
      "react-jsonschema-form-manager"
    );
  }

  const runRules = rulesRunner(schema, uiSchema, rules, Engine, extraActions);

  return FormComponent => {
    class FormWithConditionals extends Component {
      constructor(props) {
        super(props);

        this.state = { schema, uiSchema };

        this.updateSchema(this.props.formData);
      }

      componentWillReceiveProps(nextProps) {
        if (
          nextProps !== this.props &&
          !deepEquals(nextProps.formData, this.formData)
        ) {
          this.updateSchema(nextProps.formData);
          this.propsChanged = true;
        } else if (
          !deepEquals(
            nextProps,
            Object.assign({}, this.props, { formData: nextProps.formData })
          )
        ) {
          this.propsChanged = true;
        }
      }

      updateSchema = formData => {
        this.formData = formData;
        return runRules(formData).then(conf => {
          this.setState(conf);
          return conf;
        });
      };

      handleChange = state => {
        let { formData } = state;
        let updTask = this.updateSchema(formData);
        if (this.props.onChange) {
          updTask.then(conf =>
            this.props.onChange(Object.assign({}, state, conf))
          );
        }
      };

      shouldComponentUpdate(nextProps, nextState) {
        if (this.propsChanged) {
          this.propsChanged = false;
          return true;
        }
        return !deepEquals(this.state, nextState);
      }

      render() {
        let configs = Object.assign(
          {
            onChange: this.handleChange,
            formData: this.formData,
          },
          this.props,
          this.state
        );
        return <FormComponent {...configs} />;
      }
    }

    return FormWithConditionals;
  };
}
