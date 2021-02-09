import React from "react";
import {DefaultValidations} from "../validations/Default.validations";

export const Form = ({
  data,
  disabled,
  form,
  onChange,
  overrideValidationState,
  submitFailed,
  validationObject = DefaultValidations(),
}) => {

  // --[ lifecycle / effects ]-------------------------------------------------
  // SubmitFailed(
  //   submitFailed,
  //   validationObject,
  //   overrideValidationState,
  //   data
  // );

  return React.createElement(form, {
    data,
    disabled,
    onChange,
    overrideValidationState,
    submitFailed,
    validationObject,
  })
};
