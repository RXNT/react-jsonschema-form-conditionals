import validate from './validation';
import applicableActions from "./applicableActions";

export default class RulesEngine {
  constructor(rules, schema, uiSchema) {
    this.schema = schema;
    this.uiSchema = uiSchema;
    this.rules = rules;

    if (process.env.NODE_ENV !== "production") {
      validate(rules, schema);
    }
  }

  run = (formData) => {
    let self = this;
    return new Promise(function (resolve, reject) {
      try {
        resolve(applicableActions(self.rules, formData));
      } catch (err) {
        reject(err);
      }
    });
  }

}