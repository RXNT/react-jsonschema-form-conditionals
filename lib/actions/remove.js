"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = remove;

var _utils = require("../utils");

var _validateAction = require("./validateAction");

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function doRemove(_ref, uiSchema) {
  var field = _ref.field,
      schema = _ref.schema;

  var requiredIndex = schema.required ? schema.required.indexOf(field) : -1;
  if (requiredIndex !== -1) {
    schema.required.splice(requiredIndex, 1);
  }
  delete schema.properties[field];
  delete uiSchema[field];
  var fieldIndex = (uiSchema["ui:order"] ? uiSchema["ui:order"] : []).indexOf(field);
  if (fieldIndex !== -1) {
    uiSchema["ui:order"].splice(fieldIndex, 1);
  }
}

/**
 * Remove specified field both from uiSchema and schema
 *
 * @param field
 * @param schema
 * @param uiSchema
 * @returns {{schema: *, uiSchema: *}}
 */
function remove(_ref2, schema, uiSchema) {
  var field = _ref2.field;

  var fieldArr = (0, _utils.toArray)(field);
  fieldArr.forEach(function (field) {
    return doRemove((0, _utils.findRelSchemaAndField)(field, schema), (0, _utils.findRelUiSchema)(field, uiSchema));
  });
}

remove.propTypes = {
  field: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.arrayOf(_propTypes2.default.string)]).isRequired
};

remove.validate = (0, _validateAction.validateFields)("remove", function (_ref3) {
  var field = _ref3.field;

  return field;
});