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
  // random identifier for a11y
  const hash = randomString();

  // build a checkbox event object for label click
  const createEventObject = () => ({
    target: {
      name,
      checked: !checked,
    },
  });

  // mimic the event when a label is clicked on a checkbox
  const dispatchEvent = compose(onChange, createEventObject);

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
          onClick={dispatchEvent}
        >
          {label ? label : removeCamelCase(name)}
        </span>
        {error && <p role="alert">{error}</p>}
      </div>
    </>
  );
};
