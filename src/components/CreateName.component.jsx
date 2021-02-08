import { cond as firstMatch, mergeRight } from "ramda";
import React, { useState } from "react";
import { randomString, request, through, trace } from "../utils";
import { useToggle } from "../hooks/useToggle.hook";
import { NameValidations } from "../validations/Name.validations";
import { NameForm } from "../forms/Name.form";
import { emptyName } from "../models/name.model";
import { FlexRow } from "../layouts";
import { handleApiResponse } from "../apiFaker";
import { Error } from "../common/Error.common";

export const CreateName = ({ disabled }) => {
  // --[ dependencies ]--------------------------------------------------------
  const {
    forceValidationState,
    isValid,
    validateAll,
    validateAllIfTrue,
    validationErrors,
    validationState,
  } = NameValidations();

  // --[ local state ]---------------------------------------------------------
  const [name, setName] = useState(emptyName());
  const [
    hasValidationErrors,
    activateValidationErrors,
    deactivateValidationErrors,
  ] = useToggle(false);

  // --[ component logic ]-----------------------------------------------------

  /* prettier-ignore */
  // handleChange :: Name -> void
  const handleChange = through([
    validateAllIfTrue,
    setName
  ]);

  // dispatchPayload :: Name -> void
  const dispatchPayload = async (payload) => {
    request("POST", payload)
      .then((res) => res.json())
      .then(mergeRight(validationState))
      .then(
        through([
          handleApiResponse(forceValidationState),
          activateValidationErrors,
        ])
      )
      .catch(trace("whoopsies"));
  };

  /* prettier-ignore */
  // onFailure :: Name -> void
  const onFailure = through([
    trace("rendering front-end errors"),
    activateValidationErrors,
  ]);

  /* prettier-ignore */
  // onSuccess :: Name -> void
  const onSuccess = through([
    dispatchPayload,
    deactivateValidationErrors
  ]);

  // handleSubmit :: Name -> fn(Name)
  const handleSubmit = firstMatch([
    [validateAll, onSuccess],
    [(_) => true, onFailure],
  ]);

  return (
    <section>
      <fieldset>
        <legend>CreateName.component.jsx</legend>
        <FlexRow>
          <div style={{ width: "50%" }}>
            <NameForm
              data={name}
              disabled={disabled}
              onChange={handleChange}
              submitFailed={hasValidationErrors}
              validationState={validationState}
            />
          </div>
          <div style={{ width: "50%", marginLeft: "2rem" }}>
            <h2>Name State</h2>
            <pre>{JSON.stringify(name, null, 2)}</pre>
          </div>
        </FlexRow>
        <button disabled={disabled} onClick={() => handleSubmit(name)}>
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
