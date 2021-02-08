import { __, compose, mergeRight, converge, keys, head, prop } from "ramda";
import React, { useEffect } from "react";
import { Field } from "../common/Field.common";
import { maybe, through } from "../utils";
import { NameValidations } from "../validations/Name.validations";

export const NameForm = ({
  onChange,
  data,
  disabled = false,
  submitFailed,
  validationState,
}) => {
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
    converge(func, [compose(head, keys), mergeRight(data)]);

  // updateState :: event -> void
  const updateState = compose(onChange, mergeRight(data));

  /* prettier-ignore */
  // handleChange :: event -> void
  const handleChange = through([
    validateEvent(validateIfTrue),
    updateState
  ]);

  // --[ lifecycle ]-----------------------------------------------------------
  useEffect(() => {
    if (submitFailed) {
      validateAll(data);
      maybe(validationState).map(forceValidationState);
    }
  }, [submitFailed]); // eslint-disable-line

  return (
    <>
      <fieldset>
        <legend>Name.form.jsx</legend>
        <div className="form__group">
          <Field
            error={getError("firstName")}
            disabled={disabled}
            name="firstName"
            onBlur={validateEvent(validate)}
            onChange={handleChange}
            value={get("firstName")}
          />
          <Field
            disabled={disabled}
            error={getError("lastName")}
            name="lastName"
            onBlur={validateEvent(validate)}
            onChange={handleChange}
            value={get("lastName")}
          />
          <Field
            disabled={disabled}
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
