import { __, compose, mergeRight, converge, keys, head, prop } from 'ramda';
import React, {useEffect } from 'react';
import { eventNameValue, through } from '../utils';
import { NameValidations } from '../validations/nameform.validations';

export const NameForm = ({
  onChange,
  data,
  submitFailed,
}) => {
  const {
    getError,
    validate,
    validateAll,
    validateIfTrue,
  } = NameValidations();

  // get :: string -> data[string]
  const get = prop(__, data);

  // handleBlur :: InputEvent -> void
  const handleBlur = compose(
    converge(
      validate, [
        compose(head, keys),
        mergeRight(data),
      ]
    ),
    eventNameValue,
  );

  // validateChange :: InputEvent -> void
  const validateChange = compose(
    converge(
      validateIfTrue, [
        compose(head, keys),
        mergeRight(data),
      ]
    ),
    eventNameValue,
  );

  // updateState :: InputEvent -> void
  const updateState = compose(
    onChange,
    mergeRight(data),
    eventNameValue,
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
      <div className="form__group">
        <label>First Name</label>
        <input
          name="firstName"
          onBlur={handleBlur}
          onChange={handleChange}
          value={get('firstName')}
        />
        {getError('firstName') && <p>{getError('firstName')}</p>}
      </div>
      <div className="form__group">
        <label>Last Name</label>
        <input
          name="lastName"
          onBlur={handleBlur}
          onChange={handleChange}
          value={get('lastName')}
        />
        {getError('lastName') && <p>{getError('lastName')}</p>}
      </div>
    </>
  );
};

