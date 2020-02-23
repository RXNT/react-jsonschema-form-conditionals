"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findRelSchemaAndField = exports.toError = exports.toArray = exports.isDevelopment = undefined;
exports.findRelUiSchema = findRelUiSchema;

var _utils = require("json-rules-engine-simplified/lib/utils");

var isDevelopment = exports.isDevelopment = function isDevelopment() {
  return process.env.NODE_ENV !== "production";
};

var toArray = exports.toArray = function toArray(field) {
  if (Array.isArray(field)) {
    return field;
  } else {
    return [field];
  }
};

var toError = exports.toError = function toError(message) {
  if (isDevelopment()) {
    throw new ReferenceError(message);
  } else {
    console.error(message);
  }
};

/**
 * Find relevant schema for the field
 * @returns { field: "string", schema: "object" } relevant field and schema
 */
var findRelSchemaAndField = exports.findRelSchemaAndField = function findRelSchemaAndField(field, schema) {
  var separator = field.indexOf(".");
  if (separator === -1) {
    return { field: field, schema: schema };
  }

  var parentField = field.substr(0, separator);
  var refSchema = (0, _utils.extractRefSchema)(parentField, schema);
  if (refSchema) {
    return findRelSchemaAndField(field.substr(separator + 1), refSchema);
  }

  toError("Failed to retrieve " + refSchema + " from schema");
  return { field: field, schema: schema };
};

function findRelUiSchema(field, uiSchema) {
  var separator = field.indexOf(".");
  if (separator === -1) {
    return uiSchema;
  }

  var parentField = field.substr(0, separator);
  var refUiSchema = uiSchema[parentField];
  if (!refUiSchema) {
    return uiSchema;
  } else {
    return findRelUiSchema(field.substr(separator + 1), refUiSchema);
  }
}