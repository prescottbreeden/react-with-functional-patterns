import {applyTo, compose, converge, curry, map, prop} from "ramda";

export const set = curry((property, value) => ({ [property]: value }));

export const eventNameValue = compose(
  converge(
    set, [
      prop('name'),
      prop('value'),
    ]
  ),
  prop('target')
);

export const eventNameChecked = compose(
  converge(
    set, [
      prop('name'),
      prop('checked'),
    ]
  ),
  prop('target')
);

// export const nameValue = (event) => {
//   return {
//     name: event.target.name,
//     value: event.target.value,
//   };
// };

export const trace = curry((msg, x) => console.log(msg, x) || x);

export const through = curry((list, x) => map(applyTo(x), list));

export function isPropertyValid(property, validations) {
  return compose(prop('isValid'), prop(property))(validations);
}

export const randomString = () =>
  Math.random()
    .toString(36)
    .substring(7)

// -------------------------------------------------------------
//      Demo purposes??
// -------------------------------------------------------------
export const validateAll = (errors, data) => {
  return Object.keys(data).reduce((prev, current) => {
    console.log(data);
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

