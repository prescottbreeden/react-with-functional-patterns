import * as R from 'ramda';

// trace :: string -> x -> x
export const trace = R.curry((msg, x) => console.log(msg, x) || x);

// executeSideEffect :: f -> x -> x
export const executeSideEffect = R.curry((f, x) => f(x) || x);

export const doNothing = R.always(null);

// through :: [fn] -> x -> [fn(x)]
// A Wolfram Alpha inspired function that takes a list of functions
// and applies and maps an argument to each function -- excellent for
// executing a series of sideefffects with a single starting argument
export const through = R.curry((list, x) => R.map(R.applyTo(x), list));

// replaceItem :: [a] -> a -> [a]
export const replaceArrayItem = R.curry((list, property, b) => {
  return R.map((a) => (a[property] === b[property] ? b : a), list);
});

// randomString :: () -> string
export const randomString = () => Math.random().toString(36).substring(7);

// removeCamelCase :: string -> string
export const removeCamelCase = R.pipe(
  R.replace(/([A-Z])/g, " $1"),
  R.converge(R.concat, [
    R.pipe(R.head, R.toUpper),
    (x) => x.slice(1)
  ]),
);

