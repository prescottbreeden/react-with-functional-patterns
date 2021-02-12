import { always, compose, concat, ifElse } from "ramda";
import React from "react";
import { eventNameChecked } from "../utils/events";
import { randomString, removeCamelCase } from "../utils/general";
import { Error } from "./Error.common";

export const FormCheckbox = ({
  disabled = false,
  error,
  label,
  name,
  onBlur,
  onChange,
  checked,
}) => {
  const hash = randomString();
  const createEventObject = () => ({
    target: {
      name,
      checked: !checked,
    },
  });
  const dispatchEvent = ifElse(
    (_) => disabled,
    always(null),
    compose(onChange, eventNameChecked, createEventObject)
  );
  const handleBlur = compose(onBlur, eventNameChecked);
  const handleChange = compose(onChange, eventNameChecked);

  return (
    <>
      <div className="checkbox">
        <input
          aria-labelledby={concat(name, hash)}
          checked={checked}
          className="checkbox__input"
          disabled={disabled}
          name={name}
          onBlur={handleBlur}
          onChange={handleChange}
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
        <Error error={error} />
      </div>
    </>
  );
};
