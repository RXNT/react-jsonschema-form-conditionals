"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = uiOverride;

var _validateAction = require("./validateAction");

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Override original field in uiSchema with defined configuration
 *
 * @param field
 * @param schema
 * @param uiSchema
 * @param conf
 * @returns {{schema: *, uiSchema: *}}
 */
function doOverride(uiSchema, params) {
  Object.keys(params).forEach(function (field) {
    var appendVal = params[field];
    var fieldUiSchema = uiSchema[field];
    if (!fieldUiSchema) {
      uiSchema[field] = appendVal;
    } else if ((typeof appendVal === "undefined" ? "undefined" : _typeof(appendVal)) === "object" && !Array.isArray(appendVal)) {
      doOverride(fieldUiSchema, appendVal);
    } else {
      uiSchema[field] = appendVal;
    }
  });
}

function uiOverride(params, schema, uiSchema) {
  doOverride(uiSchema, params);
}

uiOverride.propTypes = _propTypes2.default.object.isRequired;
uiOverride.validate = (0, _validateAction.validateFields)("uiOverride", function (params) {
  return Object.keys(params);
});