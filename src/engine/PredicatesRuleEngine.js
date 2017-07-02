import validate from "./validation";
import applicableActions from "./applicableActions";
import { isDevelopment } from "../utils";

const engine = {
  run: (formData, rules, schema) => {
    if (isDevelopment()) {
      validate(rules.map(({ conditions }) => conditions), schema);
    }
    return new Promise(function(resolve) {
      resolve(applicableActions(rules, formData));
    });
  },
};

export default engine;
