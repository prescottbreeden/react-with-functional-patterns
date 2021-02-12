import * as R from 'ramda';

// eventNameValue :: event -> { [name]: value }
export const eventNameValue = R.pipe(
  R.prop("target"),
  R.converge(R.assoc, [
    R.prop("name"),
    R.prop("value"),
    R.always({})
  ]),
);

// eventNameValue :: event -> { [name]: checked }
export const eventNameChecked = R.pipe(
  R.prop("target"),
  R.converge(R.assoc, [
    R.prop("name"),
    R.prop("checked"),
    R.always({})
  ]),
);
