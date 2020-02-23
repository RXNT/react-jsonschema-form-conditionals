"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = uiAppend;

var _utils = require("../utils");

var _validateAction = require("./validateAction");

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Append original field in uiSchema with external configuration
 *
 * @param field
 * @param schema
 * @param uiSchema
 * @param conf
 * @returns {{schema: *, uiSchema: *}}
 */
function doAppend(uiSchema, params) {
  Object.keys(params).forEach(function (field) {
    var appendVal = params[field];
    var fieldUiSchema = uiSchema[field];
    if (!fieldUiSchema) {
      uiSchema[field] = appendVal;
    } else if (Array.isArray(fieldUiSchema)) {
      (0, _utils.toArray)(appendVal).filter(function (v) {
        return !fieldUiSchema.includes(v);
      }).forEach(function (v) {
        return fieldUiSchema.push(v);
      });
    } else if ((typeof appendVal === "undefined" ? "undefined" : _typeof(appendVal)) === "object" && !Array.isArray(appendVal)) {
      doAppend(fieldUiSchema, appendVal);
    } else if (typeof fieldUiSchema === "string") {
      if (!fieldUiSchema.includes(appendVal)) {
        uiSchema[field] = fieldUiSchema + " " + appendVal;
      }
    } else {
      uiSchema[field] = appendVal;
    }
  });
}

function uiAppend(params, schema, uiSchema) {
  doAppend(uiSchema, params);
}

uiAppend.propTypes = _propTypes2.default.object.isRequired;
uiAppend.validate = (0, _validateAction.validateFields)("uiAppend", function (params) {
  return Object.keys(params);
});