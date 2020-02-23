"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = uiReplace;

var _validateAction = require("./validateAction");

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Replace original field in uiSchema with defined configuration
 *
 * @param field
 * @param schema
 * @param uiSchema
 * @param conf
 * @returns {{schema: *, uiSchema: *}}
 */
function uiReplace(params, schema, uiSchema) {
  Object.keys(params).forEach(function (f) {
    uiSchema[f] = params[f];
  });
}

uiReplace.propTypes = _propTypes2.default.object.isRequired;
uiReplace.validate = (0, _validateAction.validateFields)("uiReplace", function (params) {
  return Object.keys(params);
});