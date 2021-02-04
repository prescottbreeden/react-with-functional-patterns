import {concat} from 'ramda';
import React from 'react';
import {randomString} from '../../utils';

export const Input = props => {
  const {
    disabled,
    error,
    label,
    name,
    value,
    onBlur,
    onChange
  } = props;

  const hash = randomString();

  return (
    <>
      <div className="form__group">
        <label htmlFor={concat(name, hash)}>
          {label ? label : name}
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

