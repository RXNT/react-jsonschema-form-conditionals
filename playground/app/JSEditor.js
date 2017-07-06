import React, { Component } from "react";
import Codemirror from "react-codemirror";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/xml/xml";

const jsOptions = {
  // theme: "default",
  // height: "auto",
  // viewportMargin: Infinity,
  mode: "javascript",
  // value: "function myScript(){return 100;}\n",
  lineNumbers: true,
  // lineWrapping: true,
  // indentWithTabs: false,
  // tabSize: 2,
};

export default class JSEditor extends Component {
  constructor(props) {
    super(props);
    this.state = { valid: true, code: props.code };
  }

  onCodeChange = code => {
    this.setState({ code });
    setImmediate(() => {
      try {
        this.props.onChange(this.state.code);
        this.setState({ valid: true });
      } catch (err) {
        this.setState({ valid: false });
      }
    });
  };

  render() {
    const { title } = this.props;
    const icon = this.state.valid ? "ok" : "remove";
    const cls = this.state.valid ? "valid" : "invalid";
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <span className={`${cls} glyphicon glyphicon-${icon}`} />
          {" " + title}
        </div>
        <Codemirror
          value={this.state.code}
          onChange={this.onCodeChange}
          options={Object.assign({}, jsOptions)}
        />
      </div>
    );
  }
}
/**
 * Created by mavarazy on 7/5/17.
 */
