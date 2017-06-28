import React, { Component } from "react";
import Form from "react-jsonschema-form";
import PropTypes from "prop-types";
import RulesExecutors from "./RulesExecutors";
import RulesEngine from "./RulesEngine";

export class FormWithConditionals extends Component {

  constructor(props) {
    super(props);

    this.rulesEngine = new RulesEngine(this.props.rules, this.props.schema, this.props.uiSchema);
    this.rulesExecutor = new RulesExecutors(this.props.rules, this.props.schema, this.props.uiSchema);

    let { formData } = this.props;
    this.rulesEngine.run(formData).
      then(this.rulesExecutor.run).
      then((newState) => {
        this.setState(newState);
      });
  }

  componentWillReceiveProps(nextProps) {
    let { schema, formData, uiSchema } = nextProps;
    this.setState({ schema, formData, uiSchema });
  }

  updateSchema = (formData = {}) => {
    return this.rulesEngine.run(formData).then(this.rulesExecutor.run);
  };

  ruleTracker = (state) => {
    let { formData } = state;
    this.rulesEngine.
      run(formData).
      then(this.rulesExecutor.run).
      then((newState) => {
        this.setState(newState);
        if (this.props.onChange) {
          this.props.onChange(Object.assign({}, state, newState));
        }
      });
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

