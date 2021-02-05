import { compose, cond as firstMatch, mergeRight } from "ramda";
import React, { useState } from "react";
import { emptyPanda } from "../models/panda.model";
import { randomString, through, trace } from "../utils";
import { PandaValidations } from "../validations/Panda.validations";
import { useToggle } from "../hooks/useToggle.hook";
import { PandaForm } from "../forms/Panda.form";

export const CreatePanda = () => {
  // --[ dependencies ]--------------------------------------------------------
  const { isValid, validateAll, validationErrors } = PandaValidations();

  // --[ local state ]---------------------------------------------------------
  const [panda, _setPanda] = useState(emptyPanda());
  const [
    hasValidationErrors,
    activateValidationErrors,
    deactivateValidationErrors,
  ] = useToggle(false);

  // --[ component logic ]-----------------------------------------------------

  // updatePanda :: { Name | Food | [Friend] } -> void
  const updatePanda = compose(_setPanda, mergeRight(panda));

  // --[ submission logic ]----------------------------------------------------
  // dispatchPayload :: Panda -> void
  const dispatchPayload = compose(
    trace("handling potential errors"),
    trace("sending payload")
  );

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
        <PandaForm
          data={panda}
          onChange={updatePanda}
          submitFailed={hasValidationErrors}
        />
        <button onClick={() => handleSubmit(panda)}>Submit</button>
        {!isValid &&
          validationErrors.map((error) => <p key={randomString()}>{error}</p>)}
      </fieldset>
    </section>
  );
};
