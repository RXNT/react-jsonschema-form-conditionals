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
let FormWithConditionals = applyRules(Form);

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

let rules = {
    ...
}

render((
  <FormWithConditionals
    schema={schema}
    rules={rules}
  />
), document.getElementById("app"));
```

In order to use FormWithPredicates
 

## Contribute

- Issue Tracker: github.com/RxNT/form-with-rules/issues
- Source Code: github.com/RxNT/form-with-rules

## Support

If you are having issues, please let us know.
We have a mailing list located at: ...

## License

The project is licensed under the ... license.
