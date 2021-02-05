import { compose, concat } from "ramda";
import React from "react";
import { randomString, removeCamelCase } from "../utils";

export const DefaultCheckbox = ({
  disabled,
  error,
  label,
  name,
  onBlur,
  onChange,
  checked,
}) => {
  const hash = randomString();
  const createFakeEvent = () => ({
    target: {
      name,
      checked: !checked,
    },
  });

  const fakeEvent = compose(onChange, createFakeEvent);

  return (
    <>
      <div className="checkbox">
        <input
          aria-labelledby={concat(name, hash)}
          checked={checked}
          className="checkbox__input"
          disabled={disabled}
          name={name}
          onBlur={onBlur}
          onChange={onChange}
          type="checkbox"
        />
        <span
          aria-label={label ? label : removeCamelCase(name)}
          className="checkbox__label"
          id={concat(name, hash)}
          onClick={fakeEvent}
        >
          {label ? label : removeCamelCase(name)}
        </span>
        {error && <p role="alert">{error}</p>}
      </div>
    </>
  );
};
