import * as R from 'ramda';
import {trace} from './general';

export const request = (url, method, payload) => {
  const baseAPI = "http://localhost:5000/api/";
  return method === "GET"
    ? fetch(R.concat(baseAPI, url), {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      })
    : fetch(R.concat(baseAPI, url), {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
};

const hasValidationError = R.compose(
  R.any(R.equals(false)),
  R.map(R.prop("isValid")),
  R.values
);

export const handleApiResponse = (validationObject, activateValidationErrors) =>
  R.ifElse(
    hasValidationError,
    R.pipe(
      trace("API returned error state"),
      R.mergeDeepRight(validationObject.validationState),
      validationObject.setValidationState,
      activateValidationErrors,
    ),
    trace("no API errors")
  );
