import {
  always,
  any,
  applyTo,
  assoc,
  compose,
  concat,
  converge,
  curry,
  defaultTo,
  equals,
  head,
  ifElse,
  length,
  lt as gt,
  map,
  mergeDeepRight,
  prop,
  replace,
  toUpper,
  trim,
  values,
} from "ramda";

// trace :: string -> x -> x
export const trace = curry((msg, x) => console.log(msg, x) || x);

// through :: [fn] -> x -> [fn(x)]
// A Wolfram Alpha inspired function that takes a list of functions
// and applies and maps an argument to each function -- excellent for
// executing a series of sideefffects with a single starting argument
export const through = curry((list, x) => map(applyTo(x), list));

// replaceItem :: [a] -> a -> [a]
export const replaceArrayItem = curry((list, property, b) => {
  return map((a) => (a[property] === b[property] ? b : a), list);
});

// randomString :: () -> string
export const randomString = () => Math.random().toString(36).substring(7);

// removeCamelCase :: string -> string
export const removeCamelCase = compose(
  converge(concat, [compose(toUpper, head), (x) => x.slice(1)]),
  replace(/([A-Z])/g, " $1")
);

// eventNameValue :: event -> { [name]: value }
export const eventNameValue = compose(
  converge(assoc, [prop("name"), prop("value"), always({})]),
  prop("target")
);

// eventNameValue :: event -> { [name]: checked }
export const eventNameChecked = compose(
  converge(assoc, [prop("name"), prop("checked"), always({})]),
  prop("target")
);

export const request = (url, method, payload) => {
  const baseAPI = "http://localhost:5000/api/";
  return method === "GET"
    ? fetch(concat(baseAPI, url), {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      })
    : fetch(concat(baseAPI, url), {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
};

const hasValidationError = compose(
  any(equals(false)),
  map(prop("isValid")),
  values
);

export const handleApiResponse = (validationObject, activateValidationErrors) =>
  ifElse(
    compose(trace("hasError"), hasValidationError),
    compose(
      activateValidationErrors,
      validationObject.forceValidationState,
      mergeDeepRight(validationObject.validationState),
      trace("API fail")
    ),
    trace("no API errors")
  );

export const cleanString = compose(trim, defaultTo(""));
export const stringNotEmpty = compose(gt(0), length, cleanString);
