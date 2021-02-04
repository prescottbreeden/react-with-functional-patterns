import {concat} from 'ramda';
import React from 'react';
import {randomString, removeCamelCase} from '../utils';

export const DefaultInput = ({
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
        <label htmlFor={concat(name, hash)}>
          {label ? label : removeCamelCase(name)}
        </label>
        <input
          disabled={disabled}
          id={concat(name, hash)}
          name={name}
          onBlur={onBlur}
          onChange={onChange}
          value={value}
        />
        {error && <p role="alert">{error}</p>}
      </div>
    </>
  );
};

