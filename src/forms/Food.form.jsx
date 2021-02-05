import { __, compose, mergeRight, converge, prop, always } from 'ramda';
import React, {useEffect } from 'react';
import {DefaultCheckbox} from '../common/DefaultCheckbox.common';
import { eventNameChecked, through } from '../utils';
import {FoodFormValidations} from '../validations/FoodForm.validations';

export const FoodForm = ({
  onChange,
  data,
  submitFailed,
}) => {
  const {
    getError,
    validate,
    validateAll,
    validateIfTrue,
  } = FoodFormValidations();

  // get :: string -> data[string]
  const get = prop(__, data);

  // handleBlur :: InputEvent -> void
  const handleBlur = compose(
    converge(
      validate, [
        always('isChecked'),
        always(data),
      ]
    ),
    eventNameChecked,
  );

  // validateChange :: InputEvent -> void
  const validateChange = compose(
    converge(
      validateIfTrue, [
        always('isChecked'),
        mergeRight(data),
      ]
    ),
    eventNameChecked,
  );

  // updateState :: InputEvent -> void
  const updateState = compose(
    onChange,
    mergeRight(data),
    eventNameChecked,
  );

  // handleChange :: InputEvent -> void
  const handleChange = through([
    validateChange,
    updateState
  ]);

  useEffect(() => {
    submitFailed && validateAll(data);
  }, [submitFailed]); // eslint-disable-line

  return (
    <section>
      <div className="form__group" >
        <fieldset >
          <legend>Food.form.jsx</legend>
          <DefaultCheckbox
            checked={get("bambooLeaves")}
            name="bambooLeaves"
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <DefaultCheckbox
            checked={get("bambooShoots")}
            name="bambooShoots"
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <DefaultCheckbox
            checked={get("bambooStems")}
            name="bambooStems"
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {getError('isChecked') && <p role="alert">{getError('isChecked')}</p>}
        </fieldset>
      </div>
    </section>
  );
};

