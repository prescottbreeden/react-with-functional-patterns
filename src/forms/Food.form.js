import { __, compose, mergeRight, converge, prop, always } from "ramda";
import React, { useEffect } from "react";
import { Error } from "../common/Error.common";
import { Field } from "../common/Field.common";
import { through } from "../utils/general";
import { maybe } from "../utils/maybe";
import { FoodFormValidations } from "../validations/FoodForm.validations";

export const FoodForm = ({
  onChange,
  data,
  disabled,
  submitFailed,
  overrideValidationState,
}) => {
  // --[ dependencies ]--------------------------------------------------------
  const v = FoodFormValidations();

  // --[ component logic ]-----------------------------------------------------
  // get :: string -> data[string]
  const get = prop(__, data);

  // validateEvent :: validationFunction -> event -> void
  const validateEvent = (func) =>
    converge(func, [always("isChecked"), mergeRight(data)]);

  // updateState :: InputEvent -> void
  const updateState = compose(onChange, mergeRight(data));

  // handleChange :: InputEvent -> void
  const handleChange = through([
    validateEvent(v.validateIfTrue),
    updateState
  ]);

  useEffect(() => {
    if (submitFailed) {
      v.validateAll(data);
      maybe(overrideValidationState).map(v.forceValidationState);
    }
  }, [submitFailed, overrideValidationState]); // eslint-disable-line

  return (
    <section>
      <div className="form__group">
        <fieldset>
          <legend>Food.form.jsx</legend>
          <Field
            checked={get("bambooLeaves")}
            disabled={disabled}
            name="bambooLeaves"
            onBlur={validateEvent(v.validate)}
            onChange={handleChange}
            type="checkbox"
          />
          <Field
            checked={get("bambooShoots")}
            disabled={disabled}
            name="bambooShoots"
            onBlur={validateEvent(v.validate)}
            onChange={handleChange}
            type="checkbox"
          />
          <Field
            checked={get("bambooStems")}
            disabled={disabled}
            name="bambooStems"
            onBlur={validateEvent(v.validate)}
            onChange={handleChange}
            type="checkbox"
          />
          <Error error={v.getError("isChecked")} />
        </fieldset>
      </div>
    </section>
  );
};
