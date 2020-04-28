import { toArray, findRelSchemaAndField, findRelUiSchema } from "../utils";
import { validateFields } from "./validateAction";
import PropTypes from "prop-types";

function doRemove({ field, schema }, uiSchema) {
  let requiredIndex = schema.required ? schema.required.indexOf(field) : -1;
  if (requiredIndex !== -1) {
    schema.required.splice(requiredIndex, 1);
  }
  delete schema.properties[field];
  delete uiSchema[field];
  let fieldIndex = (uiSchema["ui:order"] ? uiSchema["ui:order"] : []).indexOf(
    field
  );
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
export default function remove({ field }, schema, uiSchema) {
  let fieldArr = toArray(field);
  fieldArr.forEach((field) =>
    doRemove(
      findRelSchemaAndField(field, schema),
      findRelUiSchema(field, uiSchema)
    )
  );
}

remove.propTypes = {
  field: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
};

remove.validate = validateFields("remove", function ({ field }) {
  return field;
});
