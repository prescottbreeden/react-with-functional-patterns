import { compose, concat } from "ramda";
import React from "react";
import { eventNameValue, randomString, removeCamelCase } from "../utils";
import { Error } from "./Error.common";

export const FormInput = ({
  disabled,
  error,
  label,
  name,
  onBlur,
  onChange,
  value,
}) => {
  const hash = randomString();
  const handleBlur = compose(onBlur, eventNameValue);
  const handleChange = compose(onChange, eventNameValue);
  return (
    <>
      <div className="form__group">
        <label htmlFor={concat(name, hash)}>
          {label ? label : removeCamelCase(name)}
        </label>
        <input
          disabled={disabled}
          id={concat(name, hash)}
          name={name}
          onBlur={handleBlur}
          onChange={handleChange}
          value={value}
        />
        <Error error={error} />
      </div>
    </>
  );
};
