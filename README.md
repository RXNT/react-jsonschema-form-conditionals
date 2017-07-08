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


## Conditional logic

Conditional logic is based on public [predicate](https://github.com/landau/predicate) library 
with boolean logic extension. 

[Predicate](https://github.com/landau/predicate) library has a lot of predicates that we found more, than sufficient for our use cases.

### Single line conditionals

Let's say we need to `remove` `password`, when `firstName` is missing, this can be expressed like this:

```js
let rules = [{
    conditions: {
      firstName: "empty"
    },
    event: {
        type: "remove",
        params: { fields: [ "password" ] },
    }
}]
```

`FormWithPredicates` translates this rules into -
when `firstName` is `empty`, perform `remove` of `password`, pretty straightforward. 

`Empty` keyword translates to [equal in predicate library](https://landau.github.io/predicate/#equal) and required 
action will be performed only when `predicate.empty(registration.firstName)` is `true`. 


### Conditionals with arguments

Let's say we need to `remove` `telephone`, when `age` is `less` than `5`  

```js
let rules = [{
    conditions: { age: { less : 5 } },
    event: {
      type: "remove",
      params: { fields: [ "telephone" ] }
    }
}]
```

`FormWithPredicates` translates this rule into -  
when `age` is `less` than 5, `remove` `telephone` field from the schema.

[Less](https://landau.github.io/predicate/#less) keyword translates to [less in predicate](https://landau.github.io/predicate/#less) and required 
action will be performed only when `predicate.empty(registration.age, 5)` is `true`. 

### Boolean operations on a single field

#### AND

For the field AND is a default behavior.

Looking at previous rule, we decide that we want to change the rule and `remove` a `telephone`, 
when `age` is between `5` and `70`, so it would be available only to people older, than `70` and younger than `5`.

```js
let rules = [{
    conditions: {
        age: {
          greater: 5,
          less : 70,
        }
    },
    event: {
      type: "remove",
      params: { fields: [ "telephone" ] }
    }
}]
```

By default action will be applied only when both field conditions are true.
In this case, when age is `greater` than 5 and `less` than 70.
 
#### NOT

Let's say we want to change the logic to opposite, and remove telephone when 
age is greater, `less`er then `5` or `greater` than `70`, 
 
```js
let rules = [{
  conditions: {
    age: {
      not: {
          greater: 5,
          less : 70,
      }
    }
  },
  event: {
    type: "remove",
    params: { fields: "telephone"}
  }
}]
```

This does it, since the final result will be opposite of the previous result.
 
#### OR

The previous example works, but it's a bit hard to understand, luckily we can express it in more natural way
with `or` conditional.

```js
let rules = [{
  conditions: { age: { 
      or: [
        { less : 5 },
        { greater: 70 }
      ]
    }
  },
  event: {
    type: "remove",
    params: { fields: "telephone" }
  }
}]
```

This is the same as `NOT`, but easier to grasp.

### Boolean operations on multi fields

To support cases, when action depends on more, than one field meeting criteria we introduced
multi fields boolean operations.

#### Default AND operation

Let's say we want to `require` `bio`, when `age` is less than 70 and `country` is `USA`

```js
let rules = [{
  conditions: {
    age: { less : 70 },
    country: { is: "USA" }
  },
  event: { 
    type: "require",
    params: { fields: [ "bio" ]}
  }
}]
```

This is the way we can express this. By default each field is treated as a 
separate condition and all conditions must be meet.

#### OR

In addition to previous rule we need `bio`, if `state` is `NY`.

```js
let rules = [{
  conditions: {
    or: [
      {
        age: { less : 70 },
        country: { is: "USA" }
      },
      {
        state: { is: "NY"}
      }
    ]
  },
  event: { 
    type: "require",
    params: { fields: [ "bio" ]}
  }
}]
```

#### NOT

When we don't require `bio` we need `zip` code.

```js
let rules = [{
    conditions: {
      not: {
        or: [
          {
            age: { less : 70 },
            country: { is: "USA" }
          },
          {
            state: { is: "NY"}
          }
        ]
      }
    },
    event: { 
      type: "require",
      params: { fields: [ "zip" ]}
    }
}]
```

### Nested object queries

Sometimes we need to make changes to the form if some nested condition is true. 

For example if one of the `hobbies` is "baseball", make `state` `required`.
This can be expressed like this:

```js
let rules = [{
    conditions: {
      hobbies: {
        name: { equals: "baseball" },
      }
    },
    event: { 
      type: "require",
      params: { fields: [ "state" ]}
    }
}]
``` 

## Contribute

- Issue Tracker: github.com/RxNT/form-with-rules/issues
- Source Code: github.com/RxNT/form-with-rules

## Support

If you are having issues, please let us know.
We have a mailing list located at: ...

## License

The project is licensed under the ... license.
