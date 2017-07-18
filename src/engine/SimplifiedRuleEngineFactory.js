import Engine from "json-rules-engine-simplified";
import deepEqual from "deep-equal";

class SimplifiedRuleEngineFactory {
  createEngine(rules, schema) {
    this.rules = rules;
    this.schema = schema;
    this.engine = new Engine(rules, schema);
  }

  getEngine(rules, schema) {
    if (!deepEqual(this.rules, rules) || !deepEqual(this.schema, schema)) {
      this.createEngine(rules, schema);
    }
    return this.engine;
  }
}

export default new SimplifiedRuleEngineFactory();
