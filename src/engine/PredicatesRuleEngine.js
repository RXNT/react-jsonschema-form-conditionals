import validate from "./validation";
import applicableActions from "./applicableActions";

const engine = {
  validate: (rules, schema) => {
    validate(rules.map(({ conditions }) => conditions), schema);
  },
  run: (formData, rules, schema) => {
    return new Promise(function(resolve) {
      resolve(applicableActions(rules, formData));
    });
  },
};

export default engine;
