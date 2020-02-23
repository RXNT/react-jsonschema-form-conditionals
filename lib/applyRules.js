"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = applyRules;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _FormWithConditionals = require("./FormWithConditionals");

var _FormWithConditionals2 = _interopRequireDefault(_FormWithConditionals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function applyRules(schema, uiSchema, rules, Engine) {
  var extraActions = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  return function (FormComponent) {
    return function (props) {
      return _react2.default.createElement(_FormWithConditionals2.default, _extends({}, props, {
        schema: schema,
        uiSchema: uiSchema,
        rules: rules,
        Engine: Engine,
        extraActions: extraActions,
        FormComponent: FormComponent
      }));
    };
  };
}