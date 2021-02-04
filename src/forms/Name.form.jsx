import { __, compose, mergeRight, converge, keys, head, prop, concat } from 'ramda';
import React, {useEffect } from 'react';
import {Input} from '../components/formElements/input.component';
import { eventNameValue, randomString, through } from '../utils';
import { NameValidations } from '../validations/Name.validations';

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
      <div className="form__group" >
        <fieldset>
          <legend>Name</legend>
          <Input 
            error={getError('firstName')}
            name="firstName"
            onBlur={handleBlur}
            onChange={handleChange}
            value={get('firstName')}
          />
          <Input 
            error={getError('lastName')}
            name="lastName"
            onBlur={handleBlur}
            onChange={handleChange}
            value={get('lastName')}
          />
          <Input 
            name="middleName"
            onBlur={handleBlur}
            onChange={handleChange}
            value={get('middleName')}
          />
        </fieldset>
      </div>
    </>
  );
};

