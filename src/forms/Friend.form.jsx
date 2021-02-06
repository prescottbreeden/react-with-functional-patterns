import { __, compose, mergeRight, converge, keys, head, prop } from "ramda";
import React, { useEffect } from "react";
import { DefaultInput } from "../common/DefaultInput.common";
import { NameForm } from "../forms/Name.form";
import { set, eventNameValue, through } from "../utils";
import { FriendValidations } from "../validations/Friend.validations";

export const FriendForm = ({
  onChange,
  submitFailed,
  data,
  validationState,
}) => {
  // --[ dependencies ]--------------------------------------------------------
  const {
    forceValidationState,
    getError,
    validate,
    validateAll,
    validateIfTrue,
  } = FriendValidations();

  // --[ component logic ]-----------------------------------------------------
  // get :: string -> data[string]
  const get = prop(__, data);

  // validateEvent :: validationFunction -> event -> void
  const validateEvent = (func) =>
    compose(
      converge(func, [compose(head, keys), mergeRight(data)]),
      eventNameValue
    );

  // updateState :: event -> void
  const updateState = compose(onChange, mergeRight(data), eventNameValue);

  // handleChange :: event -> void
  const handleChange = through([validateEvent(validateIfTrue), updateState]);

  // handleNameChange :: Name -> void
  const handleNameChange = compose(onChange, mergeRight(data), set("name"));

  // --[ lifecycle ]-----------------------------------------------------------
  useEffect(() => {
    if (submitFailed) {
      validateAll(data);
      forceValidationState(validationState);
    }
  }, [submitFailed]); // eslint-disable-line

  return (
    <>
      <fieldset>
        <legend>Friend.form.jsx</legend>
        <div className="form__group">
          <NameForm
            data={get("name")}
            onChange={handleNameChange}
            submitFailed={submitFailed}
          />
          <DefaultInput
            error={getError("lengthOfFriendship")}
            name="lengthOfFriendship"
            onBlur={validateEvent(validate)}
            onChange={handleChange}
            value={get("lengthOfFriendship")}
          />
        </div>
      </fieldset>
    </>
  );
};
