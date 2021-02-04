import {concat} from 'ramda';
import React from 'react';
import {randomString, removeCamelCase} from '../utils';

export const DefaultCheckbox = ({
  disabled,
  error,
  label,
  name,
  onBlur,
  onChange,
  value,
}) => {
  const hash = randomString();
  return (
    <>
      <div className="form__group">
        <input
          checked={value}
          className="form__checkbox"
          disabled={disabled}
          id={concat(name, hash)}
          name={name}
          onBlur={onBlur}
          onChange={onChange}
          type="checkbox"
        />
        <label htmlFor={concat(name, hash)}>
          {label ? label : removeCamelCase(name)}
        </label>
        {error && <p role="alert">{error}</p>}
      </div>
    </>
  );
};

