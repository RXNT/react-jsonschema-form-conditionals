import { Engine } from "json-rules-engine";
import deepEqual from "deep-equal";

class CacheControlEngineFactory {
  createEngine(rules) {
    this.rules = rules;
    this.engine = new Engine();
    rules.forEach(rule => this.engine.addRule(rule));
  }

  getEngine(rules, schema) {
    if (!deepEqual(this.rules, rules)) {
      this.createEngine(rules);
    }
    return this.engine;
  }
}

export default new CacheControlEngineFactory();
