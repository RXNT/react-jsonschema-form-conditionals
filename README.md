[![Build Status](https://travis-ci.org/RxNT/react-jsonschema-form-conditionals.svg?branch=master)](https://travis-ci.org/RxNT/react-jsonschema-form-conditionals)
[![Coverage Status](https://coveralls.io/repos/github/RxNT/react-jsonschema-form-conditionals/badge.svg?branch=master)](https://coveralls.io/github/RxNT/react-jsonschema-form-conditionals?branch=master)
[![npm version](https://badge.fury.io/js/react-jsonschema-form-conditionals.svg)](https://badge.fury.io/js/react-jsonschema-form-conditionals)
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
import { SimplifiedRuleEngineFactory as Engine }  from 'react-jsonschema-form-conditionals';
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
import { SimplifiedRulesEngineFactory } from 'react-jsonschema-form-conditionals';
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
import { CacheControlRulesEngineFactory } from 'react-jsonschema-form-conditionals';
import Form from "react-jsonschema-form";

// ...

let FormWithConditionals = applyRules(Form);

ReactDOM.render(
  <FormWithConditionals
        rulesEngine={CacheControlRulesEngineFactory}
        // ...
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

Original `rules` and `schema` is used as a parameter for a factory call, 
in order to be able to have additional functionality, such as rules to schema compliance validation, 
like it's done in Simplified Json Rules Engine](https://github.com/RxNT/json-rules-engine-simplified)

## Schema action mechanism

Rules engine emits events, which are expected to have a `type` and `params` field,
`type` is used to distinguish action that is needed, `params` are used as input for that action:

```json
{
  "type": "remove",
  "params": {
    "field": "name"
  }
}
```

By default action mechanism defines a supported set of rules, which you can extend as needed:

- `remove` removes a field or set of fields from `schema` and `uiSchema`
- `require` makes a field or set of fields required

### Remove action

If you want to remove a field, your configuration should look like this:

```json
    {
      "conditions": { },
      "event": {
        "type": "remove",
        "params": {
          "field": "password"
        }
      }
    }
```
When `condition` is meet, `password` will be removed from both `schema` and `uiSchema`.
 
In case you want to remove multiple fields `name`, `password`, rule should look like this:

```json
    {
      "conditions": { },
      "event": {
        "type": "remove",
        "params": {
          "field": [ "name", "password" ]
        }
      }
    }
```
### Require action

The same convention goes for `require` action

For a single field:

```json
    {
      "conditions": { },
      "event": {
        "type": "require",
        "params": {
          "field": "password"
        }
      }
    }
```

For multiple fields:

```json
    {
      "conditions": { },
      "event": {
        "type": "require",
        "params": {
          "field": [ "name", "password"]
        }
      }
    }
```

## UiSchema actions 

API defines a set of actions, that you can take on `uiSchema`, they cover most of the 

- `uiAppend` appends `uiSchema` specified in params with an original `uiSchema`
- `uiOverride` replaces field in original `uiSchema` with fields in `params`, keeping unrelated entries
- `uiRepalce` replaces whole `uiSchema` with a conf schema

To show case, let's take a simple `schema`

```json
{
  "properties": {
    "lastName": { "type": "string" },
    "firstName": { "type": "string" },
    "nickName": { "type": "string"}
  }
}
```

and `uiSchema`

```json
{
  "ui:order": ["firstName"],
  "lastName": {
    "classNames": "col-md-1",
  },
  "firstName": {
    "ui:disabled": false,
    "num": 23
  },
  "nickName": {
    "classNames": "col-md-12"
  }
}
```
with event `params` something like this
```json
{
  "ui:order": [ "lastName" ],
  "lastName": {
    "classNames": "has-error"
  },
  "firstName" : {
    "classNames": "col-md-6",
    "ui:disabled": true,
    "num": 22
  }
}
```

And look at different results depend on the choosen action.

### uiAppend

UiAppend can handle `arrays` and `string`, with fallback to `uiOverride` behavior for all other fields.

So the expected result `uiSchema` will be:
```json
{
  "ui:order": ["firstName", "lastName"],
  "lastName": {
    "classNames": "col-md-1 has-error"
  },
  "firstName": {
    "classNames": "col-md-6",
    "ui:disabled": true,
    "num": 22
  },
  "nickName": {
    "classNames": "col-md-12"
  }
}
```

In this case it
 - added `lastName` to `ui:order` array,
 - appended `has-error` to `classNames` in `lastName` field
 - added `classNames` and enabled `firstName`
 - as for the `num` in `firstName` it just overrode it 

This is useful for example if you want to add some additional markup in your code, without touching layout that you've defined.

### uiOverride

`uiOverride` behaves similar to append, but instead of appending it completely replaces overlapping values  

So the expected result `uiSchema` will be:
```json
{
  "ui:order": [ "lastName" ],
  "lastName": {
    "classNames": "has-error"
  },
  "firstName": {
    "classNames": "col-md-6",
    "ui:disabled": true,
    "num": 22
  },
  "nickName": {
    "classNames": "col-md-12"
  }
}
```

In this case it
 - `ui:order` was replaced with configured value
 - `className` for the `lastName` was replaced with `has-error` 
 - added `classNames` and enabled `firstName`
 - as for the `num` in `firstName` it just overrode it 

### uiReplace

`uiReplace` just replaces all fields in `uiSchema` with `params` fields, leaving unrelated fields untouched.
 
So the result `uiSchema` will be
```json
{
  "ui:order": [ "lastName" ],
  "lastName": {
    "classNames": "has-error"
  },
  "firstName" : {
    "classNames": "col-md-6",
    "ui:disabled": true,
    "num": 22
  },
  "nickName": {
     "classNames": "col-md-12"
   }
}
```
 
## Extension mechanism

You can extend existing actions list, by specifying `extraActions` on the form.

Let's say we need to introduce `replaceClassNames` action, that 
would just specify `classNames` `col-md-4` for all fields except for `ignore`d one.
We also want to trigger it only when `password` is `empty`.

This is how we can do this:

```jsx
import applyRules from 'react-jsonschema-form-conditionals';
import { SimplifiedRuleEngineFactory as Engine } from 'react-jsonschema-form-conditionals';
import Form from "react-jsonschema-form";
let FormWithConditionals = applyRules(Form);

...

const rules = [
    {
        conditons: {
            password: "empty"
        },
        event: {
            type: "replaceClassNames",
            params: {
                classNames: "col-md-4",
                ignore: [ "password" ]
            }
        }
    }
];

let FormWithConditionals = applyRules(Form);

let extraActions = {
    replaceClassNames: function(params, schema, uiSchema, formData) {
        Object.keys(schema.properties).forEach((field) => {
            if (uiSchema[field] === undefined) {
                uiSchema[field] = {}
            }
            uiSchema[field].classNames = params.classNames;
        }
    }
};

ReactDOM.render(
  <FormWithConditionals
        rules = {rules}
        rulesEngine={Engine}
        schema = {schema}
        extraActions = {extraActions}
        ...
  />,
  document.querySelector('#app')
);
```

Provided snippet does just that.

### Extension with calculated values

In case you need to calculate value, based on other field values, you can also do that.

Let's say we want to have schema with `a`, `b` and `sum` fields

```jsx
import applyRules from 'react-jsonschema-form-conditionals';
import { SimplifiedRuleEngineFactory as Engine } from 'react-jsonschema-form-conditionals';
import Form from "react-jsonschema-form";
let FormWithConditionals = applyRules(Form);

...

const rules = [
    {
        conditons: {
            a: { not: "empty" },
            b: { not: "empty" }
        },
        event: {
            type: "updateSum"
        }
    }
];

let FormWithConditionals = applyRules(Form);

let extraActions = {
    updateSum: function(params, schema, uiSchema, formData) {
        formData.sum = formData.a + formData.b;
    }
};

ReactDOM.render(
  <FormWithConditionals
        rules = {rules}
        rulesEngine={Engine}
        schema = {schema}
        extraActions = {extraActions}
        ...
  />,
  document.querySelector('#app')
);
```

This is how you can do that.

WARNING!!! You need to be careful with a rules order, if you update `formData` in your action.

For example, let's say you want to mark `sum` field, if you have sum `greater` than `10`. The rule would look something like this:

```json
{
  "conditions": {
    "sum": { "greater" : 10 }
  },
  "event": {
    "type": "appendClass",
    "classNames": "has-success"
  }
}
```

But it will work only if you put it after `updateSum` rule, like this 
```json
[
    {
        "conditons": {
            "a": { "not": "empty" },
            "b": { "not": "empty" }
        },
        "event": {
            "type": "updateSum"
        }
    },
    {
      "conditions": {
        "sum": { "greater" : 10 }
      },
      "event": {
        "type": "appendClass",
        "classNames": "has-success"
      }
    }
];
```

Otherwise it will work with **old `sum` values** and therefor show incorrect value. 

## Action validation mechanism

All default actions are validated by default, checking that field exists in the schema, to save you some headaches. 
There are 2 levels of validation

- `propTypes` validation, using FB `prop-types` package
- explicit validation

You can define those validations in your actions as well, to improve actions usability.

All validation is disabled in production.
 
### Prop types action validation
 
This is reuse of familiar `prop-types` validation used with React components, and it's used in the same way:

In case of `require` it can look like this:
```js
require.propTypes = {
  field: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
};
```

The rest is magic.

WARNING, the default behavior of `prop-types` is to send errors to console,
which you need to have running in order to see them.

For our `replaceClassNames` action, it can look like this:

```js
replaceClassNames.propTypes = {
  classNames: PropTypes.string.isRequired,
  ignore: PropTypes.arrayOf(PropTypes.string)
};
```

## Explicit validation

In order to provide more granular validation, you can specify validate function on 
your action, that will receive `params`, `schema` and `uiSchema` so you could provide appropriate validation.

For example, validation for `require` can be done like this:

```js
  require.validate = function({ field }, schema, uiSchema) {
    if (Array.isArray(field)) {
      field
        .filter(f => schema && schema.properties && schema.properties[f] === undefined)
        .forEach(f => console.error(`Field  "${f}" is missing from schema on "require"`));
    } else if (
      schema &&
      schema.properties &&
      schema.properties[field] === undefined
    ) {
      console.error(`Field  "${field}" is missing from schema on "require"`);
    }
  };
```

Validation is not mandatory, and will be done only if field is provided.

For our `replaceClassNames` action, it would look similar: 
```js
  replaceClassNames.validate = function({ ignore }, schema, uiSchema) {
    if (Array.isArray(field)) {
      ignore
        .filter(f => schema && schema.properties && schema.properties[f] === undefined)
        .forEach(f => console.error(`Field  "${f}" is missing from schema on "replaceClassNames"`));
    } else if (
      schema &&
      schema.properties &&
      schema.properties[ignore] === undefined
    ) {
      console.error(`Field  "${ignore}" is missing from schema on "replaceClassNames"`);
    }
  };
```

# Listening to configuration changes

In order to listen for configuration changes you can specify `onSchemaConfChange`, which will be notified every time `schema` or `uiSchema` changes it's value. 

```js
let FormWithConditionals = applyRules(Form);

ReactDOM.render(
  <FormWithConditionals
        rules = {rules}
        rulesEngine={Engine}
        schema = {schema}
        extraActions = {extraActions}
        onSchemaConfChange = {({ schema, uiSchema }) => { console.log("configuration changed") }}
  />,
  document.querySelector('#app')
);

```

## Contribute

- Issue Tracker: github.com/RxNT/react-jsonschema-form-conditionals/issues
- Source Code: github.com/RxNT/react-jsonschema-form-conditionals

## Support

If you are having issues, please let us know.

## License

The project is licensed under the Apache-2.0 license.
