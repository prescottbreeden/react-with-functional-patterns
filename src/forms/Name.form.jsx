import { __, compose, mergeDeepRight, converge, keys, head, prop, applyTo, map } from 'ramda';
import React, {useEffect } from 'react';
import { eventNameValue } from '../utils';
import { NameValidations } from '../validations/nameform.validations';

export const NameForm = ({
  onChange,
  data,
  submitFailed,
}) => {
  // --[ dependencies ]--------------------------------------------------------
  const {
    getError,
    validate,
    validateAll,
    validateIfTrue,
  } = NameValidations();

  // --[ component logic ]-----------------------------------------------------
 
  // get :: string -> data[string]
  const get = prop(__, data);

  // validateChange :: InputEvent -> void
  const validateChange = compose(
    converge(
      validateIfTrue, [
        compose(head, keys),
        mergeDeepRight(data),
      ]
    ),
    eventNameValue,
  );

  // handleBlur :: InputEvent -> void
  const handleBlur = compose(
    converge(
      validate, [
        compose(head, keys),
        mergeDeepRight(data),
      ]
    ),
    eventNameValue,
  );

  // updateState :: InputEvent -> void
  const updateState = compose(
    onChange,
    mergeDeepRight(data),
    eventNameValue,
  );

  // handleChange :: InputEvent -> void
  const handleChange = e => map(applyTo(e), [
    validateChange,
    updateState
  ]);

  // --[ lifecycle ]-----------------------------------------------------------
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

