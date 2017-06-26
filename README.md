# FormWithPredicates

This project extends [[https://github.com/mozilla-services/react-jsonschema-form]] with conditional action logic. This is primerely useful for complicated schemas with conditional logic, which should be manageable and changeable without modifying running application.

If you need simple rule logic, that does not change a lot, you can use original mozilla project, by following examples like: https://jsfiddle.net/69z2wepo/68259/

The project is done to be compatible with existing/future mozilla Form configurations, so you can just replace Form reference to FormWithRules and specify additional rules logic and it will work as specified before:

    import FormWithRules from 'form-with-rules/FormWithRules';

    # ...
    
    const rules = {
        "remove": {
            "password": {
                "firstName": "empty",
            },
            "telephone": {
                "age": {
                    "less": 10,
                }
            }
        },
        "require": {
            "password": {
                "firstName": {
                    "is": "admin"
                }
            }
        }
    };
    
    ReactDOM.render(
      <FormWithRules
            rules={rules}
            ...            
      />,
      document.querySelector('#app')
    );

Features
--------

- Declarative conditional logic
- Extendible action engine

Having declarative conditional logic allows to change form behavior with configuration management, with no coding involved.

Installation
------------

Install form-with-rules by running:

    npm install --s form-with-rules

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
