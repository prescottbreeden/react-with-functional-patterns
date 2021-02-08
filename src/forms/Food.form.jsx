import { __, compose, mergeRight, converge, prop, always } from "ramda";
import React, { useEffect } from "react";
import { Error } from "../common/Error.common";
import { Field } from "../common/Field.common";
import { maybe, through } from "../utils";
import { FoodFormValidations } from "../validations/FoodForm.validations";

export const FoodForm = ({
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
  } = FoodFormValidations();

  // --[ component logic ]-----------------------------------------------------
  // get :: string -> data[string]
  const get = prop(__, data);

  // validateEvent :: validationFunction -> event -> void
  const validateEvent = (func) =>
    converge(func, [always("isChecked"), mergeRight(data)]);

  // updateState :: InputEvent -> void
  const updateState = compose(onChange, mergeRight(data));

  /* prettier-ignore */
  // handleChange :: InputEvent -> void
  const handleChange = through([
    validateEvent(validateIfTrue),
    updateState
  ]);

  useEffect(() => {
    if (submitFailed) {
      validateAll(data);
      maybe(validationState).map(forceValidationState);
    }
  }, [submitFailed]); // eslint-disable-line

  return (
    <section>
      <div className="form__group">
        <fieldset>
          <legend>Food.form.jsx</legend>
          <Field
            checked={get("bambooLeaves")}
            disabled={disabled}
            name="bambooLeaves"
            onBlur={validateEvent(validate)}
            onChange={handleChange}
            type="checkbox"
          />
          <Field
            checked={get("bambooShoots")}
            disabled={disabled}
            name="bambooShoots"
            onBlur={validateEvent(validate)}
            onChange={handleChange}
            type="checkbox"
          />
          <Field
            checked={get("bambooStems")}
            disabled={disabled}
            name="bambooStems"
            onBlur={validateEvent(validate)}
            onChange={handleChange}
            type="checkbox"
          />
          <Error error={getError("isChecked")} />
        </fieldset>
      </div>
    </section>
  );
};
