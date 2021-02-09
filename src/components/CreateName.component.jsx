import { cond as firstMatch } from "ramda";
import React, { useState } from "react";
import { handleApiResponse, request, through, trace } from "../utils";
import { useToggle } from "../hooks/useToggle.hook";
import { NameValidations } from "../validations/Name.validations";
import { NameForm } from "../forms/Name.form";
import { emptyName } from "../models/name.model";
import { DebugForm } from "../devTools/DebugForm.devtool";
import { ValidationErrors } from "../common/ValidationErrors.common";

export const CreateName = ({ disabled }) => {
  // --[ dependencies ]--------------------------------------------------------
  const v = NameValidations();

  // --[ local state ]---------------------------------------------------------
  const [name, setName] = useState(emptyName());
  const [
    hasValidationErrors,
    activateValidationErrors,
    deactivateValidationErrors,
  ] = useToggle(false);

  // --[ component logic ]-----------------------------------------------------

  // handleChange :: Name -> void
  const handleChange = through([
    v.validateAllIfTrue,
    setName
  ]);

  // handleSubmitResponse :: API JSON -> void
  const handleSubmitResponse = handleApiResponse(v, activateValidationErrors);

  // dispatchPayload :: Name -> void
  const dispatchPayload = async (payload) => {
    request('name', "POST", payload)
      .then((res) => res.json())
      .then(handleSubmitResponse)
      .catch(trace("whoopsies"));
  };

  // onFailure :: Name -> void
  const onFailure = through([
    trace("rendering front-end errors"),
    activateValidationErrors,
  ]);

  // onSuccess :: Name -> void
  const onSuccess = through([
    dispatchPayload,
    deactivateValidationErrors
  ]);

  // handleSubmit :: Name -> fn(Name)
  const handleSubmit = firstMatch([
    [v.validateAll, onSuccess],
    [(_) => true, onFailure],
  ]);

  return (
    <section>
      <fieldset>
        <legend>CreateName.component.jsx</legend>
        <DebugForm data={name} name="Name Form">
          <NameForm
            data={name}
            disabled={disabled}
            onChange={handleChange}
            submitFailed={hasValidationErrors}
            overrideValidationState={v.validationState}
          />
        </DebugForm>
        <button disabled={disabled} onClick={() => handleSubmit(name)}>
          Submit
        </button>
        <ValidationErrors {...v} />
      </fieldset>
    </section>
  );
};
