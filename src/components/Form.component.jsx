import { compose, converge, head, keys, mergeRight, prop, __ } from "ramda";
import { Field } from "./common/Field.common";
import { NameValidations } from "./validations/Name.validations";
import { eventNameValue, through, trace } from "./utils";
export const Form = ({ onChange, data }) => {
  const { getError, validate, validateIfTrue } = NameValidations();

  const handleBlur = compose(
    converge(validate, [compose(head, keys), mergeRight(data)]),
    eventNameValue
  );

  const handleChange = through([
    onChange,
    compose(
      converge(validateIfTrue, [compose(head, keys), mergeRight(data)]),
      eventNameValue
    ),
  ]);

  const get = prop(__, data);

  return (
    <div className="form__group" name="bob">
      <Field
        error={getError("firstName")}
        name="firstName"
        onBlur={handleBlur}
        onChange={handleChange}
        value={get("firstName")}
      />
      <Field
        error={getError("lastName")}
        name="lastName"
        onBlur={handleBlur}
        onChange={handleChange}
        value={get("lastName")}
      />
      <Field
        name="middleName"
        onChange={handleChange}
        value={get("middleName")}
      />
    </div>
  );
};
