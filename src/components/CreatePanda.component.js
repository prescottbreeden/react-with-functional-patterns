import * as R from "ramda";
import React, { useState } from "react";
import { emptyPanda } from "../models/panda.model";
import { PandaValidations } from "../validations/Panda.validations";
import { useToggle } from "../hooks/useToggle.hook";
import { PandaForm } from "../forms/Panda.form";
import { DebugForm } from "../devTools/DebugForm.devtool";
import { ValidationErrors } from "../common/ValidationErrors.common";
import { through, trace } from "../utils/general";
import { handleApiResponse, request } from "../utils/request";

export const CreatePanda = ({ disabled }) => {
  // --[ dependencies ]--------------------------------------------------------
  const v = PandaValidations();

  // --[ local state ]---------------------------------------------------------
  const [panda, setPanda] = useState(emptyPanda());
  const [
    hasValidationErrors,
    activateValidationErrors,
    deactivateValidationErrors,
  ] = useToggle(false);

  // --[ component logic ]-----------------------------------------------------
  // handleChange :: Panda -> void
  const handleChange = through([
    v.validateAllIfTrue,
    setPanda
  ]);

  // handleSubmitResponse :: API JSON -> void
  const handleSubmitResponse = handleApiResponse(v, activateValidationErrors);

  // dispatchPayload :: Panda -> void
  const dispatchPayload = async (payload) => {
    request('panda', "POST", payload)
      .then((res) => res.json())
      .then(handleSubmitResponse)
      .catch(trace("whoopsies"));
  };

  // onFailure :: Panda -> void
  const onFailure = through([
    trace("rendering front-end errors"),
    activateValidationErrors,
  ]);

  // onSuccess :: Panda -> void
  const onSuccess = through([
    dispatchPayload,
    deactivateValidationErrors
  ]);

  // handleSubmit :: Panda -> fn(Panda)
  const handleSubmit = R.cond([
    [v.validateAll, onSuccess],
    [R.always(true), onFailure],
  ]);

  return (
    <section>
      <fieldset>
        <legend>CreatePanda.component.jsx</legend>
        <DebugForm data={panda} name="Panda Form">
          <PandaForm
            data={panda}
            disabled={disabled}
            onChange={handleChange}
            submitFailed={hasValidationErrors}
          />
        </DebugForm>
        <button disabled={disabled} onClick={() => handleSubmit(panda)}>
          Submit
        </button>
        <ValidationErrors {...v} />
      </fieldset>
    </section>
  );
};
