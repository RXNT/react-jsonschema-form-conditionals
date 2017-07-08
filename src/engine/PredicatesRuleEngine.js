import Engine from "json-rules-engine-simplified";

const engine = {
  run: (formData, rules, schema) => {
    return new Engine(rules, schema).run(formData);
  },
};

export default engine;
