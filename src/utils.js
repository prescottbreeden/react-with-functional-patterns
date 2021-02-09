import {
  any,
  applyTo,
  compose,
  concat,
  converge,
  curry,
  equals,
  head,
  identity,
  ifElse,
  map,
  mergeDeepRight,
  prop,
  replace,
  toUpper
} from "ramda";

// set :: string -> x -> { [string]: x }
export const set = curry((property, value) => ({ [property]: value }));

// trace :: string -> x -> x
export const trace = curry((msg, x) => console.log(msg, x) || x);

// through :: [fn] -> x -> [fn(x)]
// A Wolfram Alpha inspired function that takes a list of functions
// and applies and maps an argument to each function -- excellent for
// executing a series of sideefffects with a single starting argument
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

export const request = (url, method, payload) => {
  const baseAPI = 'http://localhost:5000/api/';
  return method === 'GET'
    ? fetch(concat(baseAPI, url), {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    : fetch(concat(baseAPI, url), {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
}

const hasValidationError = 
  compose(
    any(equals(false)), 
    (data) => Object.keys(data).map((item) => data[item].isValid)
  );

export const handleApiResponse = (
  validationObject,
  activateValidationErrors,
) =>
  ifElse(
    hasValidationError,
    compose(
      activateValidationErrors,
      validationObject.forceValidationState,
      mergeDeepRight(validationObject.validationState),
      trace("API fail")
    ),
    trace("no API errors")
  );
// ============================================================
//                      -- Maybe --
// ============================================================
export class Maybe {
  $value;

  get isNothing() {
    return this.$value === null || this.$value === undefined;
  }

  get isJust() {
    return !this.isNothing;
  }

  constructor(x) {
    this.$value = x;
  }

  // ----- Pointed Maybe
  static of(x) {
    return new Maybe(x);
  }

  // ----- Functor Maybe
  map(fn) {
    return this.isNothing ? this : Maybe.of(fn(this.$value));
  }

  // ----- Applicative Maybe
  ap(f) {
    return this.isNothing ? this : f.map(this.$value);
  }

  // ----- Monad Maybe
  chain(fn) {
    return this.map(fn).join();
  }

  join() {
    return this.isNothing ? this : this.$value;
  }

  // ----- Traversable Maybe
  sequence(of) {
    return this.traverse(of, identity);
  }

  traverse(of, fn) {
    return this.isNothing ? of(this) : fn(this.$value).map(Maybe.of);
  }
}
export const maybe = (x) => Maybe.of(x);
export const nothing = maybe(null);
