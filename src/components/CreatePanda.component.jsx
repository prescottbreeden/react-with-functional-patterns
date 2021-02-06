import { cond as firstMatch } from "ramda";
import React, { useState } from "react";
import { emptyPanda } from "../models/panda.model";
import { randomString, through, trace } from "../utils";
import { PandaValidations } from "../validations/Panda.validations";
import { useToggle } from "../hooks/useToggle.hook";
import { PandaForm } from "../forms/Panda.form";
import {FlexRow} from "../layouts";
import { handleMockApiResponse, mockAPI } from "../apiFaker";

export const CreatePanda = () => {
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
  // handleChange :: Panda -> void
  const handleChange = through([validateAllIfTrue, setPanda]);

  // dispatchPayload :: Panda -> void
  const dispatchPayload = async (payload) => {
    mockAPI('error', payload)
      .then(handleMockApiResponse(forceValidationState))
      .catch(trace('whoopsies'));
  }

  // onFailure :: Panda -> void
  const onFailure = through([
    trace("rendering front-end errors"),
    activateValidationErrors,
  ]);

  // onSuccess :: Panda -> void
  const onSuccess = through([dispatchPayload, deactivateValidationErrors]);

  // handleSubmit :: Panda -> fn(Panda)
  const handleSubmit = firstMatch([
    [validateAll, onSuccess],
    [(_) => true, onFailure],
  ]);

  return (
    <section>
      <h1>Let's make a panda!</h1>
      <fieldset>
        <legend>CreatePanda.component.jsx</legend>
        <FlexRow>
          <div style={{ width: '50%' }}>
            <PandaForm
              data={panda}
              onChange={handleChange}
              submitFailed={hasValidationErrors}
            />
          </div>
          <div style={{ width: '50%', marginLeft: '2rem' }}>
            <h2>Panda State</h2>
            <pre>
              {JSON.stringify(panda, null, 2)}
            </pre>
          </div>
        </FlexRow>
        <button onClick={() => handleSubmit(panda)}>Submit</button>
        {!isValid &&
          validationErrors.map((error) => <p key={randomString()}>{error}</p>)}
      </fieldset>
    </section>
  );
};
