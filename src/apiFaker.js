import { any, compose, equals, ifElse } from "ramda";
import { removeCamelCase, trace } from "./utils";

/* prettier-ignore */
const hasValidationError = 
  compose(
    any(equals(false)), 
    (data) => Object.keys(data).map((item) => data[item].isValid)
  );

export const handleApiResponse = (forceValidationState) =>
  ifElse(
    hasValidationError,
    compose(forceValidationState, trace("API fail")),
    trace("no API errors")
  );

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const generateErrors = (payload) => {
  return Object.keys(payload).reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: {
        isValid: false,
        errors: [
          `${removeCamelCase(curr)} - mock API error: "${
            payload[curr]
          }" is a terrible value.`,
        ],
      },
    };
  }, {});
};
const generateSuccess = (payload) => {
  return Object.keys(payload).reduce((acc, curr) => {
    if (curr === "id") return acc;
    return {
      ...acc,
      [curr]: {
        isValid: true,
        errors: [],
      },
    };
  }, {});
};

export const mockAPI = async (status, payload) => {
  console.log("dispatched payload: ", payload);
  await delay(1000);
  return equals(status, "error")
    ? generateErrors(payload)
    : generateSuccess(payload);
};
