import { always, cond as firstMatch } from "ramda";
import React, { useState } from "react";
import { useToggle } from "../hooks/useToggle.hook";
import { FriendValidations } from "../validations/Friend.validations";
import { FriendForm } from "../forms/Friend.form";
import { emptyFriend } from "../models/friend.model";
import { DebugForm } from "../devTools/DebugForm.devtool";
import { ValidationErrors } from "../common/ValidationErrors.common";
import { through, trace } from "../utils/general";
import { handleApiResponse, request } from "../utils/request";

export const CreateFriend = ({ disabled }) => {
  // --[ dependencies ]--------------------------------------------------------
  const v = FriendValidations();

  // --[ local state ]---------------------------------------------------------
  const [friend, setFriend] = useState(emptyFriend());
  const [
    hasValidationErrors,
    activateValidationErrors,
    deactivateValidationErrors,
  ] = useToggle(false);

  // --[ component logic ]-----------------------------------------------------

  // handleChange :: Friend -> void
  const handleChange = through([
    v.validateAllIfTrue,
    setFriend
  ]);

  // handleSubmitResponse :: API JSON -> void
  const handleSubmitResponse = handleApiResponse(v, activateValidationErrors);

  // dispatchPayload :: Friend -> void
  const dispatchPayload = async (payload) => {
    request('friend', "POST", payload)
      .then((res) => res.json())
      .then(handleSubmitResponse)
      .catch(trace("whoopsies"));
  };

  // onFailure :: Friend -> void
  const onFailure = through([
    trace("rendering front-end errors"),
    activateValidationErrors,
  ]);

  // onSuccess :: Friend -> void
  const onSuccess = through([
    dispatchPayload,
    deactivateValidationErrors
  ]);

  // handleSubmit :: Friend -> fn(Friend)
  const handleSubmit = firstMatch([
    [v.validateAll, onSuccess],
    [always(true), onFailure],
  ]);

  return (
    <section>
      <fieldset>
        <legend>CreateFriend.component.jsx</legend>
        <DebugForm data={friend} name="Friend Form">
          <FriendForm
            data={friend}
            disabled={disabled}
            onChange={handleChange}
            submitFailed={hasValidationErrors}
          />
        </DebugForm>
        <button disabled={disabled} onClick={() => handleSubmit(friend)}>
          Submit
        </button>
        <ValidationErrors {...v} />
      </fieldset>
    </section>
  );
};
