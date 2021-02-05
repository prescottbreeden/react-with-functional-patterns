import {applyTo, compose, concat, converge, curry, head, map, prop, replace, slice, toUpper} from "ramda";

// set :: string -> x -> { [string]: x }
export const set = curry((property, value) => ({ [property]: value }));

// trace :: string -> x -> x
export const trace = curry((msg, x) => console.log(msg, x) || x);

// through :: [fn] -> x -> [fn(x)]
export const through = curry((list, x) => map(applyTo(x), list));

// replaceItem :: [a] -> a -> [a]
export const replaceArrayItem = curry((list, property, b) => {
  return map(a => (a[property] === b[property] ? b : a), list);
});

// randomString :: () -> string
export const randomString = () =>
  Math.random()
    .toString(36)
    .substring(7)

// removeCamelCase :: string -> string
export const removeCamelCase = compose(
  converge(concat, [
    compose(
      toUpper,
      head,
    ),
    x => x.slice(1)
  ]),
  replace(/([A-Z])/g, " $1"),
);

// eventNameValue :: event -> { [name]: value }
export const eventNameValue = compose(
  converge(
    set, [
      prop('name'),
      prop('value'),
    ]
  ),
  prop('target')
);

// eventNameValue :: event -> { [name]: checked }
export const eventNameChecked = compose(
  converge(
    set, [
      prop('name'),
      prop('checked'),
    ]
  ),
  prop('target')
);

// -------------------------------------------------------------
//      Demo purposes??
// -------------------------------------------------------------
export const validateAll = (errors, data) => {
  return Object.keys(data).reduce((prev, current) => {
    return {
      ...prev,
      [current]: {
        error: errors[current].validation(data[current]),
        validation: errors[current].validation,
      }
    };
  }, {});
};

export const validateProp = curry((errors, data) => {
  const name = Object.keys(data)[0];
  return {
    ...errors,
    [name]: {
      error: errors[name].validation(data[name]),
      validation: errors[name].validation,
    }
  }
});

export const validatePropIfTrue = curry((errors, data) => {
  const name = Object.keys(data)[0];
  if (errors[name].validation(data[name]) === '') {
    return {
      ...errors,
      [name]: {
        error: errors[name].validation(data[name]),
        validation: errors[name].validation,
      }
    }
  } else {
    return errors;
  }
});

