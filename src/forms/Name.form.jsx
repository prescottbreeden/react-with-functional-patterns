import { __, compose, mergeRight, converge, keys, head, prop } from "ramda";
import React, { useEffect } from "react";
import { DefaultInput } from "../common/DefaultInput.common";
import { eventNameValue, through } from "../utils";
import { NameValidations } from "../validations/Name.validations";

export const NameForm = ({ onChange, data, submitFailed }) => {
  const { getError, validate, validateAll, validateIfTrue } = NameValidations();

  // get :: string -> data[string]
  const get = prop(__, data);

  // handleBlur :: DefaultInputEvent -> void
  const handleBlur = compose(
    converge(validate, [compose(head, keys), mergeRight(data)]),
    eventNameValue
  );

  // validateChange :: DefaultInputEvent -> void
  const validateChange = compose(
    converge(validateIfTrue, [compose(head, keys), mergeRight(data)]),
    eventNameValue
  );

  // updateState :: DefaultInputEvent -> void
  const updateState = compose(onChange, mergeRight(data), eventNameValue);

  // handleChange :: DefaultInputEvent -> void
  const handleChange = through([validateChange, updateState]);

  useEffect(() => {
    submitFailed && validateAll(data);
  }, [submitFailed]); // eslint-disable-line

  return (
    <>
      <fieldset>
        <legend>Name.form.jsx</legend>
        <div className="form__group">
          <DefaultInput
            error={getError("firstName")}
            name="firstName"
            onBlur={handleBlur}
            onChange={handleChange}
            value={get("firstName")}
          />
          <DefaultInput
            error={getError("lastName")}
            name="lastName"
            onBlur={handleBlur}
            onChange={handleChange}
            value={get("lastName")}
          />
          <DefaultInput
            name="middleName"
            onBlur={handleBlur}
            onChange={handleChange}
            value={get("middleName")}
          />
        </div>
      </fieldset>
    </>
  );
};
