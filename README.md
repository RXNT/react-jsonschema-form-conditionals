# Form with conditionals

This project extends [react-jsonschema-form](https://github.com/mozilla-services/react-jsonschema-form) with conditional schema / uiSchema changes.
This is primarily useful for complicated schemas with conditional logic,
which should/can be manageable and changeable without modifying running application.

If you need simple rule logic, that does not change a lot, you can use original mozilla project,
by following examples like: https://jsfiddle.net/69z2wepo/68259/

The project is done to be fully compatible with existing/future mozilla Form releases.
All it does is decorating original Form with additional `rules` configuration.

```jsx
import FormWithConditionals from 'react-jsonschema-form-conditionals';

# ...

const rules = {
    ...
};

ReactDOM.render(
  <FormWithConditionals
        rules = {rules}
        schema = {schema}
        ...
  />,
  document.querySelector('#app')
);
```

## Features

- Declarative conditional logic
- Extensible action engine
- Ability to change rules, with simple reconfiguration

Having declarative conditional logic allows to change form behavior with configuration management, with no coding involved.

## Installation

Install form-with-rules by running:

```bash
npm install --s react-jsonschema-form-conditionals
```

## Usage

To show case uses for this library we'll be using simple registration schema example 

```jsx

import FormWithConditionals from "react-jsonschema-form-conditionals";

let schema = {
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
let rules = {
    password: {
        action: "remove",
        when: { firstName: "empty" },
    }
}
```

`FormWithPredicates` translates this rules into - for `password` field perform `remove`, 
when `firstName` is `empty`, pretty straightforward. 

`Empty` keyword translates to [equal in predicate library](https://landau.github.io/predicate/#equal) and required 
action will be performed only when `predicate.empty(registration.firstName)` is `true`. 


### Conditionals with arguments

Let's say we need to `remove` `telephone`, when `age` is `less` than `5`  

```js
let rules = {
    telephone: {
        action: "remove",
        when: { age: { less : 5 } }
    }
}
```

`FormWithPredicates` translates this rule into - for `telephone` field perform `remove`, 
when `age` is `less` than 5.

[Less](https://landau.github.io/predicate/#less) keyword translates to [less in predicate](https://landau.github.io/predicate/#less) and required 
action will be performed only when `predicate.empty(registration.age, 5)` is `true`. 

### Boolean logic on a field level

#### AND logic

For the field AND is a default behavior.

Looking at previous rule, we decide that we want to change the rule and `remove` a `telephone`, 
when `age` is between `5` and `70`, so it would be available only to people older, than `70` and yonger than `5`.

```js
let rules = {
  telephone: {
      action: "remove",
      when: {
        age: {
          greater: 5,
          less : 70,
        }
      }
  }
}
```

By default action will be applied only when both field conditions are true.
In this case, when age is `greater` than 5 and `less` than 70.
 
#### NOT logic

Let's say we want to change the logic to opposite, and remove telephone when 
age is greater, `less`er then `5` or `greater` than `70`, 
 
```js
let rules = {
  telephone: {
      action: "remove",
      when: {
        age: {
          not: {
              greater: 5,
              less : 70,
          }
        }
      }
  }
}
```

This does it, since the final result will be opposite of the previous result.
 
#### OR logic

The previous example works, but it's a bit hard to understand, luckily we can express it in more natural way
with `or` conditional.

```js
let rules = {
  telephone: {
      action: "remove",
      when: { age: { 
        or: [
          { less : 5 },
          { greater: 70 }
        ]
      }
    }
  }
}
```

This is the same as NOT, but easier to grasp.


## Contribute

- Issue Tracker: github.com/RxNT/form-with-rules/issues
- Source Code: github.com/RxNT/form-with-rules

## Support

If you are having issues, please let us know.
We have a mailing list located at: ...

## License

The project is licensed under the ... license.
