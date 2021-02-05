import { __, compose, mergeRight, converge, keys, head, prop } from 'ramda';
import React, {useEffect} from 'react';
import {DefaultInput} from '../common/DefaultInput.component';
import { NameForm } from '../forms/Name.form';
import { set, eventNameValue, through } from '../utils';
import {FriendValidations} from '../validations/Friend.validations';

export const FriendForm = ({
  onChange,
  submitFailed,
  data,
}) => {
  const {
    getError,
    validate,
    validateAll,
    validateIfTrue,
  } = FriendValidations();

  // handleNameChange :: Name -> void
  const handleNameChange = compose(
    onChange,
    mergeRight(data),
    set("name")
  );

  // handleBlur :: DefaultInputEvent -> void
  const handleBlur = compose(
    converge(
      validate, [
        compose(head, keys),
        mergeRight(data),
      ]
    ),
    eventNameValue,
  );

  // validateChange :: DefaultInputEvent -> void
  const validateChange = compose(
    converge(
      validateIfTrue, [
        compose(head, keys),
        mergeRight(data),
      ]
    ),
    eventNameValue,
  );

  // updateState :: DefaultInputEvent -> void
  const updateState = compose(
    onChange,
    mergeRight(data),
    eventNameValue,
  );

  // handleChange :: DefaultInputEvent -> void
  const handleChange = through([
    validateChange,
    updateState
  ]);

  useEffect(() => {
    submitFailed && validateAll(data);
  }, [submitFailed]); // eslint-disable-line

  const get = prop(__, data);
  return (
    <>
      <fieldset>
        <legend>Friend.form.js</legend>
        <div className="form__group">
          <NameForm
            data={get('name')}
            onChange={handleNameChange}
            submitFailed={submitFailed}
          />
          <DefaultInput 
            error={getError("lengthOfFriendship")}
            name="lengthOfFriendship"
            onBlur={handleBlur}
            onChange={handleChange}
            value={get('lengthOfFriendship')}
          />
        </div>
      </fieldset>
    </>
  );
};

