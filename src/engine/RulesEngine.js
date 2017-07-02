import { Engine } from "json-rules-engine";
import deepEqual from "deep-equal";

class EngineFactory {
  createEngine(rules) {
    this.rules = rules;
    this.engine = new Engine();
    rules.forEach(rule => this.engine.addRule(rule));
  }

  getEngine(rules) {
    if (!deepEqual(this.rules, rules)) {
      this.createEngine(rules);
    }
    return this.engine;
  }
}

const factory = new EngineFactory();

export default class RulesEngine {
  run = (formData, rules) => {
    let engine = factory.getEngine(rules);
    return engine.run(formData);
  };
}
