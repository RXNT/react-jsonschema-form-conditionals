export default class Actions {
  remove(field, schema, uiSchema) {
      delete schema.properties[field];
      delete uiSchema[field];
  }
}
