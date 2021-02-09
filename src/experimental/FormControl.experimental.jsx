import { cond as firstMatch } from "ramda";
import React, { useEffect, useState } from "react";
import { randomString, through } from "../utils";
import { useToggle } from "../hooks/useToggle.hook";
import { FlexRow } from "../layouts";
import { Error } from "../common/Error.common";
import {DefaultValidations} from "../validations/Default.validations";

export const FormControl = ({
  disabled,
  form,
  data,
  initialData,
  onChange = () => null,
  onSubmit,
  submitFailed,
  validationObject,
}) => {
  // --[ dependencies ]--------------------------------------------------------
  const {
    isValid,
    validateAll,
    validateAllIfTrue,
    validationErrors,
    validationState,
  } = validationObject || DefaultValidations();

  // --[ local state ]---------------------------------------------------------
  const [formData, setFormData] = useState(initialData ? initialData : data);
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
    setFormData,
    onChange,
  ]);

  /* prettier-ignore */
  // onSuccess :: Name -> void
  const onSuccess = through([
    onSubmit,
    deactivateValidationErrors
  ]);

  // handleSubmit :: Name -> fn(Name)
  const handleSubmit = firstMatch([
    [validateAll, onSuccess],
    [(_) => true, activateValidationErrors],
  ]);

  // --[ lifecycle / effects ]-------------------------------------------------
  useEffect(() => {
    data && setFormData(data);
  }, [data]);

  useEffect(() => {
    submitFailed && activateValidationErrors();
  }, [submitFailed, activateValidationErrors]);

  return (
    <section>
      <fieldset>
        <legend>FormControl.common.jsx</legend>
        <FlexRow>
          <div style={{ width: "50%" }}>
            {React.createElement(form, {
              data: formData,
              disabled,
              onChange: handleChange,
              submitFailed: hasValidationErrors,
              validationState,
            })}
          </div>
          <div style={{ width: "50%", marginLeft: "2rem" }}>
            <h2>Form Control State</h2>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
          </div>
        </FlexRow>
        <button disabled={disabled} onClick={() => handleSubmit(formData)}>
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
