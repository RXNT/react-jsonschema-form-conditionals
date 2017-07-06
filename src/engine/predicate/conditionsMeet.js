import { isObject, toError } from "../../utils";
import checkField from "./checkField";
import selectn from "selectn";

export default function conditionsMeet(conditions, formData) {
  if (!isObject(conditions) || !isObject(formData)) {
    toError(`Rule ${conditions} with ${formData} can't be processed`);
  }
  return Object.keys(conditions).every(ref => {
    if (ref === "or") {
      return conditions[ref].some(subRule => conditionsMeet(subRule, formData));
    } else if (ref === "and") {
      return conditions[ref].every(subRule =>
        conditionsMeet(subRule, formData)
      );
    } else {
      let refVal = selectn(ref, formData);
      let refFieldRule = conditions[ref];
      return checkField(refVal, refFieldRule);
    }
  });
}
