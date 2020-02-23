"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_ACTIONS = undefined;
exports.default = execute;

var _remove = require("./remove");

var _remove2 = _interopRequireDefault(_remove);

var _require2 = require("./require");

var _require3 = _interopRequireDefault(_require2);

var _uiAppend = require("./uiAppend");

var _uiAppend2 = _interopRequireDefault(_uiAppend);

var _uiReplace = require("./uiReplace");

var _uiReplace2 = _interopRequireDefault(_uiReplace);

var _uiOverride = require("./uiOverride");

var _uiOverride2 = _interopRequireDefault(_uiOverride);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_ACTIONS = exports.DEFAULT_ACTIONS = {
  remove: _remove2.default,
  require: _require3.default,
  uiAppend: _uiAppend2.default,
  uiReplace: _uiReplace2.default,
  uiOverride: _uiOverride2.default
};

function execute(_ref, schema, uiSchema, formData, formContext) {
  var type = _ref.type,
      params = _ref.params;
  var extraActions = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  var action = extraActions[type] ? extraActions[type] : DEFAULT_ACTIONS[type];
  action(params, schema, uiSchema, formData, formContext);
}