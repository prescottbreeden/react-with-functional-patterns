import { cond as firstMatch } from "ramda";
import React, { useState } from "react";
import { emptyPanda } from "../models/panda.model";
import { randomString, through, trace } from "../utils";
import { PandaValidations } from "../validations/Panda.validations";
import { useToggle } from "../hooks/useToggle.hook";
import { PandaForm } from "../forms/Panda.form";
import { FlexRow } from "../layouts";
import { handleApiResponse, mockAPI } from "../apiFaker";
import { Error } from "../common/Error.common";

export const CreatePanda = ({ disabled }) => {
  // --[ dependencies ]--------------------------------------------------------
  const {
    forceValidationState,
    isValid,
    validateAll,
    validateAllIfTrue,
    validationErrors,
  } = PandaValidations();

  // --[ local state ]---------------------------------------------------------
  const [panda, setPanda] = useState(emptyPanda());
  const [
    hasValidationErrors,
    activateValidationErrors,
    deactivateValidationErrors,
  ] = useToggle(false);

  // --[ component logic ]-----------------------------------------------------
  /* prettier-ignore */
  // handleChange :: Panda -> void
  const handleChange = through([
    validateAllIfTrue,
    setPanda
  ]);

  // dispatchPayload :: Panda -> void
  const dispatchPayload = async (payload) => {
    mockAPI("error", payload)
      .then(handleApiResponse(forceValidationState))
      .catch(trace("whoopsies"));
  };

  /* prettier-ignore */
  // onFailure :: Panda -> void
  const onFailure = through([
    trace("rendering front-end errors"),
    activateValidationErrors,
  ]);

  /* prettier-ignore */
  // onSuccess :: Panda -> void
  const onSuccess = through([
    dispatchPayload,
    deactivateValidationErrors
  ]);

  // handleSubmit :: Panda -> fn(Panda)
  const handleSubmit = firstMatch([
    [validateAll, onSuccess],
    [(_) => true, onFailure],
  ]);

  return (
    <section>
      <fieldset>
        <legend>CreatePanda.component.jsx</legend>
        <FlexRow>
          <div style={{ width: "50%" }}>
            <PandaForm
              data={panda}
              disabled={disabled}
              onChange={handleChange}
              submitFailed={hasValidationErrors}
            />
          </div>
          <div style={{ width: "50%", marginLeft: "2rem" }}>
            <h2>Panda State</h2>
            <pre>{JSON.stringify(panda, null, 2)}</pre>
          </div>
        </FlexRow>
        <button disabled={disabled} onClick={() => handleSubmit(panda)}>
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
