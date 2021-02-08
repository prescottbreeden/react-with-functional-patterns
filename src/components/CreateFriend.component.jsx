import { cond as firstMatch } from "ramda";
import React, { useState } from "react";
import { randomString, through, trace } from "../utils";
import { useToggle } from "../hooks/useToggle.hook";
import { FriendValidations } from "../validations/Friend.validations";
import { FriendForm } from "../forms/Friend.form";
import { emptyFriend } from "../models/friend.model";
import { FlexRow } from "../layouts";
import { handleMockApiResponse, mockAPI } from "../apiFaker";
import { Error } from "../common/Error.common";

export const CreateFriend = ({ disabled = false }) => {
  // --[ dependencies ]--------------------------------------------------------
  const {
    forceValidationState,
    isValid,
    validateAll,
    validateAllIfTrue,
    validationErrors,
  } = FriendValidations();

  // --[ local state ]---------------------------------------------------------
  const [friend, setFriend] = useState(emptyFriend());
  const [
    hasValidationErrors,
    activateValidationErrors,
    deactivateValidationErrors,
  ] = useToggle(false);

  // --[ component logic ]-----------------------------------------------------

  /* prettier-ignore */
  // handleChange :: Friend -> void
  const handleChange = through([
    validateAllIfTrue,
    setFriend
  ]);

  // dispatchPayload :: Friend -> void
  const dispatchPayload = async (payload) => {
    mockAPI("error", payload)
      .then(handleMockApiResponse(forceValidationState))
      .catch(trace("whoopsies"));
  };

  /* prettier-ignore */
  // onFailure :: Friend -> void
  const onFailure = through([
    trace("rendering front-end errors"),
    activateValidationErrors,
  ]);

  /* prettier-ignore */
  // onSuccess :: Friend -> void
  const onSuccess = through([
    dispatchPayload,
    deactivateValidationErrors
  ]);

  // handleSubmit :: Friend -> fn(Friend)
  const handleSubmit = firstMatch([
    [validateAll, onSuccess],
    [(_) => true, onFailure],
  ]);

  return (
    <section>
      <h1>Let's make a Friend!</h1>
      <fieldset>
        <legend>CreateFriend.component.jsx</legend>
        <FlexRow>
          <div style={{ width: "50%" }}>
            <FriendForm
              data={friend}
              disabled={disabled}
              onChange={handleChange}
              submitFailed={hasValidationErrors}
            />
          </div>
          <div style={{ width: "50%", marginLeft: "2rem" }}>
            <h2>Friend State</h2>
            <pre>{JSON.stringify(friend, null, 2)}</pre>
          </div>
        </FlexRow>
        <button disabled={disabled} onClick={() => handleSubmit(friend)}>
          Submit
        </button>
        {!isValid &&
          validationErrors.map((error) => (
            <Error key={randomString()} error={error} />
          ))}
      </fieldset>
    </section>
  );
};
