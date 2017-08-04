import React, { Component } from "react";
import Form from "react-jsonschema-form";
import playground, {
  playgroundWithStates,
} from "react-jsonschema-form-playground";
import applyRules from "../../src/applyRules";
import samples from "./samples";

let editors = [
  {
    type: "json",
    title: "Rules",
    prop: "rules",
  },
  {
    type: "viewer",
    title: "Active Schema",
    prop: "activeSchema",
  },
  {
    type: "viewer",
    title: "Active UI",
    prop: "activeUiSchema",
  },
];

let FormToDisplay = playgroundWithStates(
  playground(applyRules(Form), editors),
  samples
);

export default class ResultForm extends Component {
  constructor(props) {
    super(props);
  }

  handleChange = ({ schema, uiSchema, formData }) => {
    this.setState({ activeSchema: schema, activeUiSchema: uiSchema, formData });
  };

  render() {
    let conf = Object.assign({}, this.props, this.state);
    return <FormToDisplay {...conf} />;
  }
}
