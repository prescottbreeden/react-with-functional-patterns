import * as R from "ramda";
import React, { useEffect } from "react";
import { Field } from "../common/Field.common";
import { NameForm } from "../forms/Name.form";
import { through } from "../utils/general";
import { maybe } from "../utils/maybe";
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
  const get = R.prop(R.__, data);

  // validateEvent :: validationFunction -> FieldEvent -> void
  const validateEvent = (func) =>
    R.converge(func, [R.compose(R.head, R.keys), R.mergeRight(data)]);

  // updateState :: FieldEvent -> void
  const updateState = R.compose(onChange, R.mergeRight(data));

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
      maybe(overrideValidationState).map(v.setValidationState);
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
            onChange={R.compose(handleChange, R.assoc("name", R.__, {}))}
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
