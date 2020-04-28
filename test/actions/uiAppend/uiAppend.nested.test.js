import { schema } from "./nested/schema.json";
import { uiSchema } from "./nested/uiSchema.json";
import { rules } from "./nested/rules.json";
import deepCopy from "deepcopy";
import Engine from "json-rules-engine-simplified";
import runRules from "../../../src/rulesRunner";

test("updates uiSchema only of target field", () => {
  return runRules(
    schema,
    uiSchema,
    rules,
    Engine,
    {}
  )({
    vitals: { bloodPressure: { sitting: { pulse: 100 } } },
  }).then((res) => {
    let expectedUiSchema = deepCopy(uiSchema);
    expectedUiSchema.vitals.bloodPressure.sitting.pulse.classNames =
      "custom-field-label col-md-3 has-success vitals-success";

    expect(res.schema).toEqual(schema);
    expect(res.uiSchema).toEqual(expectedUiSchema);
  });
});
