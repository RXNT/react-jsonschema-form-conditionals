# Form with conditionals

This project extends [react-jsonschema-form](https://github.com/mozilla-services/react-jsonschema-form) with 
conditional logic, which allow to have more complicated logic expressed and controlled with JSON schema.
This is primarily useful for complicated schemas with extended business logic,
which are suspect to changes and need to be manageable and changeable without modifying running application.

If you need simple rule logic, that does not change a lot, you can use original [mozilla project](https://github.com/mozilla-services/react-jsonschema-form),
by following examples like https://jsfiddle.net/69z2wepo/68259/

The project is done to be fully compatible with mozilla, 
without imposing additional limitations.

## Features

- Support for [Json Rules Engine](https://github.com/CacheControl/json-rules-engine) and [json-rules-engine-simplified](https://github.com/RxNT/json-rules-engine-simplified) 
- Extensible action mechanism
- Configuration over coding
- Lightweight and extensible

## Installation

Install `react-jsonschema-form-conditionals` by running:

```bash
npm install --s react-jsonschema-form-conditionals
```

## Usage

The simplest example of using `react-jsonschema-form-conditionals`

```jsx
import applyRules from 'react-jsonschema-form-conditionals';
import Engine from 'react-jsonschema-form-conditionals/engine/SimplifiedRuleEngineFactory';
import Form from "react-jsonschema-form";
let FormWithConditionals = applyRules(Form);

...

const rules = [{
    ...
}];

let FormWithConditionals = applyRules(Form);

ReactDOM.render(
  <FormWithConditionals
        rules = {rules}
        rulesEngine={Engine}
        schema = {schema}
        ...
  />,
  document.querySelector('#app')
);
```

To show case uses for this library we'll be using simple registration schema example 

```jsx

import applyRules from 'react-jsonschema-form-conditionals';
import Form from "react-jsonschema-form";

let schema = {
  definitions: {
    hobby: {
      type: "object",
      properties: {
        name: { type: "string" },
        durationInMonth: { "type": "integer" },
      }
    }
  },
  title: "A registration form",
  description: "A simple form example.",
  type: "object",
  required: [
    "firstName",
    "lastName"
  ],
  properties: {
    firstName: {
      type: "string",
      title: "First name"
    },
    lastName: {
      type: "string",
      title: "Last name"
    },
    age: {
      type: "integer",
      title: "Age",
    },
    bio: {
      type: "string",
      title: "Bio",
    },
    country: {
      type: "string",
      title: "Country" 
    },
    state: {
      type: "string",
      title: "State" 
    },
    zip: {
      type: "string",
      title: "ZIP" 
    },
    password: {
      type: "string",
      title: "Password",
      minLength: 3
    },
    telephone: {
      type: "string",
      title: "Telephone",
      minLength: 10
    },
    hobbies: {
        type: "array",
        items: { "$ref": "#/definitions/hobby" }
    }
  }
}

let rules = [{
    ...
}]

let FormWithConditionals = applyRules(Form);

render((
  <FormWithConditionals
    schema={schema}
    rules={rules}
  />
), document.getElementById("app"));
```

Conditionals functionality is build using 2 things
- Rules engine ([Json Rules Engine](https://github.com/CacheControl/json-rules-engine) or [Simplified Json Rules Engine](https://github.com/RxNT/json-rules-engine-simplified))
- Schema action mechanism 

Rules engine responsibility is to trigger events, action mechanism 
performs needed actions on the requests.

## Rules engine

Project supports 2 rules engines out of the box:
- [Json Rules Engine](https://github.com/CacheControl/json-rules-engine) 
- [Simplified Json Rules Engine](https://github.com/RxNT/json-rules-engine-simplified)

### Enabling rules engine
 
In order to use one or another you need to specify `EngineFactory` to use,
which provides additional optimizations above the original rules engine.

### [Simplified Json Rules Engine](https://github.com/RxNT/json-rules-engine-simplified) factory

To use [Simplified Json Rules Engine](https://github.com/RxNT/json-rules-engine-simplified), you need to specify `SimplifiedRulesEngineFactory` 
as a `rulesEngine` in `FormWithConditionals`

For example:
```jsx

import applyRules from 'react-jsonschema-form-conditionals';
import SimplifiedRulesEngineFactory from 'react-jsonschema-form-conditionals/engine/SimplifiedRuleEngineFactory';
import Form from "react-jsonschema-form";
let FormWithConditionals = applyRules(Form);

...

let FormWithConditionals = applyRules(Form);

ReactDOM.render(
  <FormWithConditionals
        rules = {rules}
        rulesEngine={SimplifiedRulesEngineFactory}
        schema = {schema}
        ...
  />,
  document.querySelector('#app')
);
```

That is it, now rules are expected to be in accordance with [Simplified Json Rules Engine](https://github.com/RxNT/json-rules-engine-simplified)

### Cache Control [Json Rules Engine](https://github.com/CacheControl/json-rules-engine) 

To use [Json Rules Engine](https://github.com/RxNT/json-rules-engine-simplified), you need to specify `CacheControlRulesEngineFactory` 
as a `rulesEngine` in `FormWithConditionals`

For example: 
```js

import applyRules from 'react-jsonschema-form-conditionals';
import CacheControlRulesEngineFactory from 'react-jsonschema-form-conditionals/engine/CacheControlRulesEngineFactory';
import Form from "react-jsonschema-form";
let FormWithConditionals = applyRules(Form);

...

let FormWithConditionals = applyRules(Form);

ReactDOM.render(
  <FormWithConditionals
        rulesEngine={CacheControlRulesEngineFactory}
        ...
  />,
  document.querySelector('#app')
);
```

### Extending rules engine

If non of the provided engines satisfies, your needs, you can 
implement your own `EngineFactory` and `Engine` which should 
comply to following:

```js
class EngingFactory {
  getEngine(rules, schema) {
    return Engine;
  }
}

class Engine {
  run() {
    return Promise[Event];
  }
}
```

Original `rules` and `schema` is used as a parameter for a factory call.

## Schema action mechanism

Rules engine emits events, which are expected to be of a specific type:

```js
{
  type: "remove",
  params: {
    fields: ["name"]
  }
}
```

## Contribute

- Issue Tracker: github.com/RxNT/form-with-rules/issues
- Source Code: github.com/RxNT/form-with-rules

## Support

If you are having issues, please let us know.
We have a mailing list located at: ...

## License

The project is licensed under the ... license.
