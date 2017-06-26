Form with conditionals
----------------------

This project extends [[https://github.com/mozilla-services/react-jsonschema-form]] with conditional schema / uiSchema changes.
This is primarily useful for complicated schemas with conditional logic,
which should/can be manageable and changeable without modifying running application.

If you need simple rule logic, that does not change a lot, you can use original mozilla project,
by following examples like: https://jsfiddle.net/69z2wepo/68259/

The project is done to be fully compatible with existing/future mozilla Form releases.
All it does is decorating original Form with additional `rules` configuration.

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

Features
--------

- Declarative conditional logic
- Extensible action engine
- Ability to change rules, with simple reconfiguration

Having declarative conditional logic allows to change form behavior with configuration management, with no coding involved.

Installation
------------

Install form-with-rules by running:

    npm install --s react-jsonschema-form-conditionals

Usage
-----

To show case uses for this library we'll be using simple registration schema example 

    ...
    
    import FormWithConditionals from "react-jsonschema-form-conditionals";
    
    let schema = {
      "title": "A registration form",
      "description": "A simple form example.",
      "type": "object",
      "required": [
        "firstName",
        "lastName"
      ],
      "properties": {
        "firstName": {
          "type": "string",
          "title": "First name"
        },
        "lastName": {
          "type": "string",
          "title": "Last name"
        },
        "age": {
          "type": "integer",
          "title": "Age"
        },
        "bio": {
          "type": "string",
          "title": "Bio"
        },
        "password": {
          "type": "string",
          "title": "Password",
          "minLength": 3
        },
        "telephone": {
          "type": "string",
          "title": "Telephone",
          "minLength": 10
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

In order to use FormWithPredicates


Conditional logic
------------

Conditional logic is based on public predicate library - [[https://github.com/landau/predicate]] 
with boolean logic extension. 

Predicate library has a lot of predicates that we found more, than sufficient for our use cases.

##### Single line conditionals

Let's say we need to remove password, when `firstName` is missing, this can be expressed like this:

    let rules = {
        "password": {
            "action": "remove",
            "when": { firstName: "empty" },
        }
    }

`FormWithPredicates` translates this JSON into - for `password` field perform `remove` action, 
when `firstName` is `empty`, pretty straightforward. 

`Empty` keyword translates to [[https://landau.github.io/predicate/#equal]] and required 
action will be performed only when `predicate.empty(registration.firstName)` is true. 


##### Comparable conditions

Let's say we need to remove telephone, when `age` is `less`er than 5  

    let rules = {
        "password": {
            "action": "remove",
            "when": {
                "age": {
                    "less": 5
                }
            }
        }
    }

`FormWithPredicates` translates this JSON into - for `password` field perform `remove` action, 
when `age` is `less`er than 5.

`Less` keyword translates to [[https://landau.github.io/predicate/#less]] and required 
action will be performed only when `predicate.empty(registration.age, 5)` is true. 

Contribute
----------

- Issue Tracker: github.com/RxNT/form-with-rules/issues
- Source Code: github.com/RxNT/form-with-rules

Support
-------

If you are having issues, please let us know.
We have a mailing list located at: ...

License
-------

The project is licensed under the ... license.
