import React, { Component } from "react";
import PropTypes from "prop-types";
import deepEqual from "deep-equal";
import { isDevelopment } from "./utils";
import runRules from "./runRules";

export default function applyRules(FormComponent) {
  class FormWithConditionals extends Component {
    constructor(props) {
      super(props);

      let { schema, uiSchema, formData } = this.props;
      this.state = { schema, uiSchema, formData };

      this.formData = formData;
      this.handleChange({ formData });
    }

    sameSchema = nextProps => {
      return deepEqual(
        { schema: nextProps.schema, uiSchema: nextProps.uiSchema },
        { schema: this.props.schema, uiSchema: this.props.uiSchema }
      );
    };

    sameFormData = nextProps => {
      return deepEqual(nextProps.formData, this.formData);
    };

    componentWillReceiveProps(nextProps) {
      let { schema, uiSchema, formData } = nextProps;
      if (!this.sameSchema(nextProps) || !this.sameFormData(nextProps)) {
        this.setState({ schema, uiSchema, formData }, () =>
          this.handleChange({ formData })
        );
      }
    }

    shouldComponentUpdate(nextProps, nextState) {
      let sameData = this.sameFormData(nextProps);
      let sameState = deepEqual(nextState, this.state);
      let sameProps = deepEqual(
        Object.assign({}, this.props, { formData: this.formData }),
        nextProps
      );
      return !sameProps || !sameData || !sameState;
    }

    updateState = (changedFormData, conf) => {
      this.formData = conf.formData;
      let sameConf = deepEqual(
        { schema: conf.schema, uiSchema: conf.uiSchema },
        { schema: this.state.schema, uiSchema: this.state.uiSchema }
      );
      let sameForm = deepEqual(changedFormData, conf.formData);
      if (!sameConf || !sameForm) {
        this.setState(Object.assign({}, conf));
      }
    };

    handleChange = state => {
      let { formData } = state;
      runRules(formData, this.props).then(conf => {
        this.updateState(formData, conf);
        if (this.props.onChange) {
          state = Object.assign({}, state, conf);
          this.props.onChange(state);
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

  if (isDevelopment()) {
    FormWithConditionals.propTypes = {
      rulesEngine: PropTypes.func.isRequired,
      rules: PropTypes.arrayOf(
        PropTypes.shape({
          conditions: PropTypes.object.isRequired,
          event: PropTypes.shape({
            type: PropTypes.string.isRequired,
          }),
        })
      ).isRequired,
      extraActions: PropTypes.object,
    };
  }

  return FormWithConditionals;
}
