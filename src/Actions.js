class Actions {
  remove(field, schema, uiSchema) {
      delete schema.properties[field];
      delete uiSchema[field];
      return { schema, uiSchema };
  }
}

export default new Actions();
