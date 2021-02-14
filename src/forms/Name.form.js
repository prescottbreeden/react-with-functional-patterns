import * as R from "ramda";
import React, { useEffect } from "react";
import { Field } from "../common/Field.common";
import { through } from "../utils/general";
import { maybe } from "../utils/maybe";
import { NameValidations } from "../validations/Name.validations";

export const NameForm = ({
  onChange,
  data,
  disabled,
  submitFailed,
  overrideValidationState,
}) => {
  // --[ dependencies ]--------------------------------------------------------
  const v = NameValidations();

  // --[ component logic ]-----------------------------------------------------
  // get :: string -> data[string]
  const get = R.prop(R.__, data);

  // validateEvent :: validationFunction -> event -> void
  const validateEvent = (func) =>
    R.converge(func, [R.compose(R.head, R.keys), R.mergeRight(data)]);

  // updateState :: event -> void
  const updateState = R.compose(onChange, R.mergeRight(data));

  /* prettier-ignore */
  // handleChange :: event -> void
  const handleChange = through([
    validateEvent(v.validateIfTrue),
    updateState
  ]);

  // --[ lifecycle ]-----------------------------------------------------------
  useEffect(() => {
    if (submitFailed) {
      v.validateAll(data);
      maybe(overrideValidationState).map(v.setValidationState);
    }
  }, [submitFailed, overrideValidationState]); // eslint-disable-line

  return (
    <>
      <fieldset>
        <legend>Name.form.jsx</legend>
        <div className="form__group">
          <Field
            error={v.getError("firstName")}
            disabled={disabled}
            name="firstName"
            onBlur={validateEvent(v.validate)}
            onChange={handleChange}
            value={get("firstName")}
          />
          <Field
            disabled={disabled}
            error={v.getError("lastName")}
            name="lastName"
            onBlur={validateEvent(v.validate)}
            onChange={handleChange}
            value={get("lastName")}
          />
          <Field
            disabled={disabled}
            name="middleName"
            onBlur={validateEvent(v.validate)}
            onChange={handleChange}
            value={get("middleName")}
          />
        </div>
      </fieldset>
    </>
  );
};
