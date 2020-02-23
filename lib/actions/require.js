"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _utils = require("../utils");

var _validateAction = require("./validateAction");

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function doRequire(_ref) {
  var field = _ref.field,
      schema = _ref.schema;

  if (!schema.required) {
    schema.required = [];
  }

  if (schema.required.indexOf(field) === -1) {
    schema.required.push(field);
  }
}

/**
 * Makes provided field required
 *
 * @param params
 * @param schema
 * @param uiSchema
 * @returns {{schema: *, uiSchema: *}}
 */
function _require(_ref2, schema) {
  var field = _ref2.field;

  var fieldArr = (0, _utils.toArray)(field);
  (0, _utils.toArray)(fieldArr).forEach(function (field) {
    return doRequire((0, _utils.findRelSchemaAndField)(field, schema));
  });
}

exports.default = _require;
_require.propTypes = {
  field: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.arrayOf(_propTypes2.default.string)]).isRequired
};

_require.validate = (0, _validateAction.validateFields)("require", function (_ref3) {
  var field = _ref3.field;

  return field;
});