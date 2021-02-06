import { __, compose, mergeRight, converge, prop, always } from "ramda";
import React, { useEffect } from "react";
import { DefaultCheckbox } from "../common/DefaultCheckbox.common";
import { eventNameChecked, through } from "../utils";
import { FoodFormValidations } from "../validations/FoodForm.validations";

export const FoodForm = ({ onChange, data, submitFailed }) => {
  const {
    getError,
    validate,
    validateAll,
    validateIfTrue,
  } = FoodFormValidations();

  // get :: string -> data[string]
  const get = prop(__, data);

  // validateEvent :: validationFunction -> event -> void
  const validateEvent = (func) =>
    compose(
      converge(func, [always("isChecked"), mergeRight(data)]),
      eventNameChecked
    );

  // updateState :: InputEvent -> void
  const updateState = compose(onChange, mergeRight(data), eventNameChecked);

  // handleChange :: InputEvent -> void
  const handleChange = through([validateEvent(validateIfTrue), updateState]);

  useEffect(() => {
    submitFailed && validateAll(data);
  }, [submitFailed]); // eslint-disable-line

  return (
    <section>
      <div className="form__group">
        <fieldset>
          <legend>Food.form.jsx</legend>
          <DefaultCheckbox
            checked={get("bambooLeaves")}
            name="bambooLeaves"
            onBlur={validateEvent(validate)}
            onChange={handleChange}
          />
          <DefaultCheckbox
            checked={get("bambooShoots")}
            name="bambooShoots"
            onBlur={validateEvent(validate)}
            onChange={handleChange}
          />
          <DefaultCheckbox
            checked={get("bambooStems")}
            name="bambooStems"
            onBlur={validateEvent(validate)}
            onChange={handleChange}
          />
          {getError("isChecked") && <p role="alert">{getError("isChecked")}</p>}
        </fieldset>
      </div>
    </section>
  );
};
