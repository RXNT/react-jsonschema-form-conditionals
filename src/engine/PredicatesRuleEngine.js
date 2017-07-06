import validate from "./predicate/validation";
import applicableActions from "./predicate/applicableActions";

const engine = {
  validate: (rules, schema) => {
    validate(rules.map(({ conditions }) => conditions), schema);
  },
  run: (formData, rules, schema) => {
    engine.validate(rules, schema);
    return new Promise(function(resolve) {
      resolve(applicableActions(rules, formData));
    });
  },
};

export default engine;
