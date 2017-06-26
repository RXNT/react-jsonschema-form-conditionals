import React from "react";
import FormWithRules from "../../src/FormWithRules";

const schema = {
  "title": "A registration form",
  "type": "object",
  "required": ["firstName", "lastName"],
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
};

const uiSchema = {
  "firstName": {
    "classNames": "col-md-4 col-xs-4",
    "ui:autofocus": true,
    "ui:emptyValue": ""
  },
  "lastName": {
    "classNames": "col-md-4 col-xs-4"
  },
  "age": {
    "classNames": "col-md-4 col-xs-4",
    "ui:widget": "updown",
    "ui:title": "Age of person"
  },
  "bio": {
    "ui:widget": "textarea",
    "classNames": "col-md-12"
  },
  "password": {
    "classNames": "col-md-6 col-xs-6",
    "ui:widget": "password",
    "ui:help": "Hint: Make it strong!"
  },
  "date": {
    "classNames": "col-md-6 col-xs-6",
    "ui:widget": "alt-datetime"
  },
  "telephone": {
    "classNames": "col-md-6 col-xs-6",
    "ui:options": {
      "inputType": "tel"
    }
  },
};

const rules = {
  "hide": {
    "password": {
      "firstName": "empty",
    },
    "telephone": {
      "age": {
        "or": {
          "greater": 70,
          "less": 10,
        }
      }
    }
  },
  "red": {
    "password": {
      "firstName": {
        "is": "admin"
      }
    }
  }
};

const formData = {
  lastName: "",
  firstName: "",
  age: 20
};

export default class App extends React.Component {
  render() {
    return (
      <div className="container">
        <FormWithRules
          rules={rules}
          liveValidate={false}
          safeRenderCompletion={true}
          noHtml5Validate={true}
          formData={formData}
          schema={schema}
          uiSchema={uiSchema}
        />
      </div>
    );
  }
}
