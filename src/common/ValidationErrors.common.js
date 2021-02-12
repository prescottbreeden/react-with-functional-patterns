import React from 'react';
import { Error } from "../common/Error.common";
import { randomString } from "../utils/general";

export const ValidationErrors = ({
  isValid,
  validationErrors
}) => {
  return (
    <>
      {!isValid &&
        validationErrors.map((error) => (
          <Error key={randomString()} error={error} />
        ))}
    </>
  );
};

