import { __, compose, mergeRight, converge, keys, head, prop } from "ramda";
import React, { useEffect } from "react";
import { Field } from "../common/Field.common";
import { NameForm } from "../forms/Name.form";
import { maybe, set, through } from "../utils";
import { FriendValidations } from "../validations/Friend.validations";

export const FriendForm = ({
  onChange,
  submitFailed,
  data,
  disabled,
  overrideValidationState,
}) => {
  // --[ dependencies ]--------------------------------------------------------
  const v = FriendValidations();

  // --[ component logic ]-----------------------------------------------------
  // get :: string -> data[string]
  const get = prop(__, data);

  // validateEvent :: validationFunction -> FieldEvent -> void
  const validateEvent = (func) =>
    converge(func, [compose(head, keys), mergeRight(data)]);

  // updateState :: FieldEvent -> void
  const updateState = compose(onChange, mergeRight(data));

  /* prettier-ignore */
  // handleChange :: FieldEvent -> void
  const handleChange = through([
    validateEvent(v.validateIfTrue),
    updateState
  ]);

  // --[ lifecycle ]-----------------------------------------------------------
  useEffect(() => {
    if (submitFailed) {
      v.validateAll(data);
      maybe(overrideValidationState).map(v.forceValidationState);
    }
  }, [submitFailed, overrideValidationState]); // eslint-disable-line

  return (
    <>
      <fieldset>
        <legend>Friend.form.jsx</legend>
        <div className="form__group">
          <NameForm
            disabled={disabled}
            data={get("name")}
            onChange={compose(handleChange, set("name"))}
            submitFailed={submitFailed}
          />
          <Field
            disabled={disabled}
            error={v.getError("lengthOfFriendship")}
            name="lengthOfFriendship"
            onBlur={validateEvent(v.validate)}
            onChange={handleChange}
            value={get("lengthOfFriendship")}
          />
        </div>
      </fieldset>
    </>
  );
};
