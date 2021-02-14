import * as R from "ramda";
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
  const get = R.prop(R.__, data);

  // validateEvent :: validationFunction -> event -> void
  const validateEvent = (func) =>
    R.converge(func, [R.always("isChecked"), R.mergeRight(data)]);

  // updateState :: InputEvent -> void
  const updateState = R.compose(onChange, R.mergeRight(data));

  // handleChange :: InputEvent -> void
  const handleChange = through([validateEvent(v.validateIfTrue), updateState]);

  useEffect(() => {
    if (submitFailed) {
      v.validateAll(data);
      maybe(overrideValidationState).map(v.setValidationState);
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
