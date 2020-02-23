"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateFields = undefined;

exports.default = function (action, params, schema, uiSchema) {
  if (action.propTypes !== undefined && action.propTypes !== null) {
    _propTypes2.default.checkPropTypes(action.propTypes, params, "prop", action);
  }

  if (action.validate && typeof action.validate === "function") {
    action.validate(params, schema, uiSchema);
  }
};

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require("../utils");

var _utils2 = require("json-rules-engine-simplified/lib/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hasField = function hasField(field, schema) {
  var separator = field.indexOf(".");
  if (separator === -1) {
    return schema.properties[field] !== undefined;
  } else {
    var parentField = field.substr(0, separator);
    var refSchema = (0, _utils2.extractRefSchema)(parentField, schema);
    return refSchema ? hasField(field.substr(separator + 1), refSchema) : false;
  }
};

var validateFields = exports.validateFields = function validateFields(action, fetchFields) {
  if (!fetchFields) {
    (0, _utils.toError)("validateFields requires fetchFields function");
    return;
  }
  return function (params, schema) {
    var relFields = (0, _utils.toArray)(fetchFields(params));
    relFields.filter(function (field) {
      return !hasField(field, schema);
    }).forEach(function (field) {
      return (0, _utils.toError)("Field \"" + field + "\" is missing from schema on \"" + action + "\"");
    });
  };
};