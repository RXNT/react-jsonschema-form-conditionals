import React from "react";

import { inspect } from "util";

export default function ({ schema, uiSchema, rules, values, extraActions }) {
  const actions = {};
  Object.keys(extraActions || {}).forEach((k) => {
    if (typeof extraActions[k] === "function") {
      actions[k] = extraActions[k].toString();
    } else {
      actions[k] = inspect(extraActions[k]);
    }
  });

  return (
    <>
      <h4>Rules</h4>
      <pre className="bg-dark text-light p-3 small" style={{ maxHeight: 200 }}>
        {JSON.stringify(rules, null, 2)}
      </pre>

      <h4>Schema</h4>
      <pre className="bg-dark text-light p-3 small" style={{ maxHeight: 200 }}>
        {JSON.stringify(schema, null, 2)}
      </pre>

      <h4>UI Schema</h4>
      <pre className="bg-dark text-light p-3 small" style={{ maxHeight: 200 }}>
        {JSON.stringify(uiSchema, null, 2)}
      </pre>

      <h4>Form values</h4>
      <pre className="bg-dark text-light p-3 small" style={{ maxHeight: 200 }}>
        {JSON.stringify(values, null, 2)}
      </pre>

      <h4>Extra actions</h4>
      <pre className="bg-dark text-light p-3 small" style={{ maxHeight: 200 }}>
        {JSON.stringify(actions, null, 2)}
      </pre>
    </>
  );
}
