import * as R from 'ramda';

export const cleanString = R.pipe(R.defaultTo(""), R.trim);
export const stringNotEmpty = R.pipe(cleanString, R.length, R.gt(R.__, 0));
