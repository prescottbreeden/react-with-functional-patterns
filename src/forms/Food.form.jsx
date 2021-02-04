import { __, compose, mergeRight, converge, prop, always } from 'ramda';
import React, {useEffect } from 'react';
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
    <>
      <div className="form__group" >
        <fieldset >
          <legend>Food</legend>
          <div className="form__group">
            <input
              checked={get("bambooLeaves")}
              className="form__checkbox"
              id="check_1"
              name="bambooLeaves"
              onBlur={handleBlur}
              onChange={handleChange}
              type="checkbox"
            />
            <label htmlFor="check_1">Bamboo Leaves</label>
          </div>
          <div className="form__group">
            <input
              checked={get("bambooShoots")}
              className="form__checkbox"
              id="check_2"
              name="bambooShoots"
              onBlur={handleBlur}
              onChange={handleChange}
              type="checkbox"
            />
            <label htmlFor="check_2">Bamboo Shoots</label>
          </div>
          <div className="form__group">
            <input
              checked={get("bambooStems")}
              className="form__checkbox"
              id="check_3"
              name="bambooStems"
              onBlur={handleBlur}
              onChange={handleChange}
              type="checkbox"
            />
            <label htmlFor="check_3">Bamboo Stems</label>
          </div>
          {getError('isChecked') && <p role="alert">{getError('isChecked')}</p>}
        </fieldset>
      </div>
    </>
  );
};

