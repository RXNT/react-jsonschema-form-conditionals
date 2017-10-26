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

        let { formData } = this.props;
        this.state = { schema, uiSchema, formData };

        this.formData = formData;
        this.handleChange(this.state);
      }

      sameFormData = nextProps => {
        return deepEquals(nextProps.formData, this.formData);
      };

      componentWillReceiveProps(nextProps) {
        let { formData } = nextProps;
        if (!this.sameFormData(nextProps)) {
          this.setState({ formData }, () => this.handleChange({ formData }));
        }
      }

      handleChange = state => {
        let { formData } = state;
        runRules(formData).then(conf => {
          this.setState(conf);
          if (this.props.onChange) {
            this.props.onChange(Object.assign({}, state, conf));
          }
        });
      };

      render() {
        let configs = Object.assign({}, this.props, this.state, {
          onChange: this.handleChange,
        });
        return <FormComponent {...configs} />;
      }
    }

    return FormWithConditionals;
  };
}
