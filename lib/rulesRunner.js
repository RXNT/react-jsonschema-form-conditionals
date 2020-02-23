"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.normRules = normRules;
exports.default = rulesRunner;

var _actions = require("./actions");

var _actions2 = _interopRequireDefault(_actions);

var _deepcopy = require("deepcopy");

var _deepcopy2 = _interopRequireDefault(_deepcopy);

var _utils = require("react-jsonschema-form/lib/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function doRunRules(engine, formData, schema, uiSchema, formContext) {
  var extraActions = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  var schemaCopy = (0, _deepcopy2.default)(schema);
  var uiSchemaCopy = (0, _deepcopy2.default)(uiSchema);
  var formDataCopy = (0, _deepcopy2.default)(formData);
  var formContextCopy = (0, _deepcopy2.default)(formContext);

  var res = engine.run(_extends({}, formData, { formContext: formContext })).then(function (events) {
    events.forEach(function (event) {
      return (0, _actions2.default)(event, schemaCopy, uiSchemaCopy, formDataCopy, formContextCopy, extraActions);
    });
  });

  return res.then(function () {
    return {
      schema: schemaCopy,
      uiSchema: uiSchemaCopy,
      formData: formDataCopy,
      formContext: formContextCopy
    };
  });
}

function normRules(rules) {
  return rules.sort(function (a, b) {
    if (a.order === undefined) {
      return b.order === undefined ? 0 : 1;
    }
    return b.order === undefined ? -1 : a.order - b.order;
  });
}

function rulesRunner(schema, uiSchema, rules, engine, extraActions) {
  var validateSchema = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;

  var schemaWithFormContext = (0, _deepcopy2.default)(schema);
  schemaWithFormContext.properties.formContext = { type: "object" };
  engine = typeof engine === "function" ? new engine([], validateSchema ? schemaWithFormContext : undefined) : engine;
  normRules(rules).forEach(function (rule) {
    return engine.addRule(rule);
  });

  return function (formData, formContext) {
    if (formData == null && formContext == null) {
      return Promise.resolve({ schema: schema, uiSchema: uiSchema, formData: formData, formContext: formContext });
    }

    return doRunRules(engine, formData, schema, uiSchema, formContext, extraActions).then(function (conf) {
      if ((0, _utils.deepEquals)(conf.formData, formData) && (0, _utils.deepEquals)(conf.formContext, formContext)) {
        return conf;
      } else {
        return doRunRules(engine, conf.formData, schema, uiSchema, formContext, extraActions);
      }
    });
  };
}