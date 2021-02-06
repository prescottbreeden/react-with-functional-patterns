import { __, compose, mergeRight, converge, keys, head, prop } from "ramda";
import React, { useEffect } from "react";
import { DefaultInput } from "../common/DefaultInput.common";
import { eventNameValue, through } from "../utils";
import { NameValidations } from "../validations/Name.validations";

export const NameForm = ({ onChange, data, submitFailed, validationState }) => {
  // --[ dependencies ]--------------------------------------------------------
  const {
    forceValidationState,
    getError,
    validate,
    validateAll,
    validateIfTrue,
  } = NameValidations();

  // --[ component logic ]-----------------------------------------------------
  // get :: string -> data[string]
  const get = prop(__, data);

  // validateEvent :: validationFunction -> event -> void
  const validateEvent = (func) =>
    compose(
      converge(func, [compose(head, keys), mergeRight(data)]),
      eventNameValue
    );

  // updateState :: event -> void
  const updateState = compose(onChange, mergeRight(data), eventNameValue);

  // handleChange :: event -> void
  const handleChange = through([validateEvent(validateIfTrue), updateState]);

  // --[ lifecycle ]-----------------------------------------------------------
  useEffect(() => {
    if (submitFailed) {
      validateAll(data);
      forceValidationState(validationState);
    }
  }, [submitFailed]); // eslint-disable-line

  return (
    <>
      <fieldset>
        <legend>Name.form.jsx</legend>
        <div className="form__group">
          <DefaultInput
            error={getError("firstName")}
            name="firstName"
            onBlur={validateEvent(validate)}
            onChange={handleChange}
            value={get("firstName")}
          />
          <DefaultInput
            error={getError("lastName")}
            name="lastName"
            onBlur={validateEvent(validate)}
            onChange={handleChange}
            value={get("lastName")}
          />
          <DefaultInput
            name="middleName"
            onBlur={validateEvent(validate)}
            onChange={handleChange}
            value={get("middleName")}
          />
        </div>
      </fieldset>
    </>
  );
};
