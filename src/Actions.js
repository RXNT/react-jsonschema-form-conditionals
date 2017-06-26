class Actions {
  remove = (field, schema, uiSchema) => {
    delete schema.properties[field];
    delete uiSchema[field];
    return { schema, uiSchema };
  }

  require = (field, schema, uiSchema) => {
    if (!schema.required) {
      schema.required = [];
    }
    schema.required.push(field);
    return { schema, uiSchema };
  }
}

export default new Actions();
