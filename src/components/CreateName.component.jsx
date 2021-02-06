import { compose, cond as firstMatch } from "ramda";
import React, { useState } from "react";
import { randomString, through, trace } from "../utils";
import { useToggle } from "../hooks/useToggle.hook";
import { NameValidations } from "../validations/Name.validations";
import { NameForm } from "../forms/Name.form";
import { emptyName } from "../models/name.model";

export const CreateName = () => {
  // --[ dependencies ]--------------------------------------------------------
  const {
    isValid,
    validateAll,
    validateAllIfTrue,
    validationErrors,
  } = NameValidations();

  // --[ local state ]---------------------------------------------------------
  const [name, setName] = useState(emptyName());
  const [
    hasValidationErrors,
    activateValidationErrors,
    deactivateValidationErrors,
  ] = useToggle(false);

  // --[ component logic ]-----------------------------------------------------

  // handleChange :: Name -> void
  const handleChange = through([validateAllIfTrue, setName]);

  // dispatchPayload :: Name -> void
  const dispatchPayload = compose(
    trace("handling potential errors"),
    trace("sending payload")
  );

  // onFailure :: Name -> void
  const onFailure = through([
    trace("rendering front-end errors"),
    activateValidationErrors,
  ]);

  // onSuccess :: Name -> void
  const onSuccess = through([dispatchPayload, deactivateValidationErrors]);

  // handleSubmit :: Name -> fn(Name)
  const handleSubmit = firstMatch([
    [validateAll, onSuccess],
    [(_) => true, onFailure],
  ]);

  return (
    <section>
      <h1>Let's make a Name!</h1>
      <fieldset>
        <legend>CreateName.component.jsx</legend>
        <NameForm
          data={name}
          onChange={handleChange}
          submitFailed={hasValidationErrors}
        />
        <button onClick={() => handleSubmit(name)}>Submit</button>
        {!isValid &&
          validationErrors.map((error) => <p key={randomString()}>{error}</p>)}
      </fieldset>
    </section>
  );
};
