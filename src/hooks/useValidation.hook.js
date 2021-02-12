import { useState, useEffect } from "react";
import * as R from 'ramda';
import { executeSideEffect } from "../utils";
import { maybe } from "fp-tools";

/**
 * A hook that can be used to generate an object containing functions and
 * properties pertaining to the validation state provided.
 * @param validationSchema an object containing all properties to validate
 * @returns validationObject
 */
export const useValidation = (validationSchema) => {
  // --[ state constructor ]---------------------------------------------------
  const createValidationsState = schema => {
    const buildState = R.reduce((acc, key) => ({
      ...acc,
      [key]: {
        isValid: true,
        errors: [],
      }, 
    }), {});
    return maybe(schema)
      .map(R.keys)
      .map(buildState)
      .map(R.defaultTo({}))
      .join();
    ;
  }

  // --[ local states ]--------------------------------------------------------
  const [validationState, setValidationState] = useState(
    createValidationsState(validationSchema)
  );
  const [validationErrors, setValidationErros] = useState([]);

  // --[ hook logic ] ---------------------------------------------------------
  // updateValidationState :: ValidationState -> ValidationState
  const updateValidationState = executeSideEffect(setValidationState);

  // isPropertyValid :: string -> boolean
  const isPropertyValid = property => R.path([property, 'isValid']);

  // resetValidationState :: () -> void
  const resetValidationState = () =>
    R.pipe(
      createValidationsState,
      setValidationState,
    )(validationSchema);

  // runAllValidators :: string -> x -> ValidationState
  const updatePropertyOnState = R.curry((property, value) => {
    const valueIsValid = R.pipe(R.prop("validation"), R.applyTo(value));
    const getErrorOrNone = 
      R.ifElse(
        valueIsValid,
        R.always(''),
        R.prop('error')
      );
    return maybe(validationSchema[property])
      .map(R.values)
      .map(R.map(getErrorOrNone))
      .map(R.filter(R.pipe(R.length, R.lt(0))))
      .map((errors) => ({ errors, isValid: !errors.length }))
      .map(R.assoc(property, R.__, validationState))
      .join();
  });

  // validate :: string -> value -> boolean
  const validate = (property, value) => 
    maybe(value)
      .map(updatePropertyOnState(property))
      .map(R.mergeRight(validationState))
      .map(updateValidationState)
      .map(isPropertyValid(property))
      .map(R.defaultTo(true))
      .join();

  // validateIfTrue :: string -> value -> boolean
  const validateIfTrue = (property, value) => 
    maybe(value)
      .map(updatePropertyOnState(property))
      .map(R.mergeRight(validationState))
      .map(R.ifElse(
        isPropertyValid(property),
        updateValidationState,
        R.always(null)
      ))
      .map(R.defaultTo(true))
      .join();

  // validationAllIfTrue :: (x, [string]) -> boolean
  const validateAll = (value, props = Object.keys(validationSchema)) => {
    const reduceStateUpdates = (acc, property) => ({
      ...acc,
      ...updatePropertyOnState(property, value),
    });
    return maybe(props)
      .map(R.reduce(reduceStateUpdates, {}))
      .map(R.mergeRight(validationState))
      .map(updateValidationState)
      .map(isValid)
      .map(R.defaultTo(true))
      .join();
  };

  // validationAllIfTrue :: (x, [string]) -> boolean
  const validateAllIfTrue = (value, props = Object.keys(validationSchema)) => {
    const reduceValids = (acc, property) => {
      const updated = updatePropertyOnState(property, value);
      return updated[property].isValid
        ? { ...acc, ...updated }
        : { ...acc, ...validationState[property] };
    };
    return maybe(props)
      .map(R.reduce(reduceValids), {})
      .map(R.mergeRight(validationState))
      .map(isValid)
      .map(R.defaultTo(true))
      .join();
  };

  // getAllErrors :: (string, ValidationState) -> [string]
  const getAllErrors = (property, vState = validationState) => {
    const errors = maybe(vState)
      .map(R.prop(property))
      .map(R.prop("errors"));
    return errors.isJust ? errors.join() : [];
  };

  // getError :: (string, ValidationState) -> string
  const getError = (property, vState = validationState) => {
    const error = maybe(vState)
      .map(R.prop(property))
      .map(R.prop("errors"))
      .map(R.head);
    return error.isJust ? error.join() : "";
  };

  // getFieldValid :: (string, ValidationState) -> boolean
  const getFieldValid = (property, vState = validationState) => {
    const valid = maybe(vState)
      .map(R.prop(property))
      .map(R.prop("isValid"));
    return valid.isJust ? valid.join() : true;
  };

  // isValid :: ValidationState -> boolean
  const isValid = (state = validationState) => {
    return R.reduce(
      (acc, curr) => acc ? isPropertyValid(curr, state) : acc,
      true,
      Object.keys(state)
    );
  };

  // generateValidationErrors :: ValidationState -> [string]
  const generateValidationErrors = (state) => {
    return R.reduce(
      (acc, curr) => getError(curr) ? [...acc, getError(curr)] : acc,
      [],
      Object.keys(state)
    );
  };

  // -- update validation error array when validation state changes
  useEffect(() => {
    setValidationErros(generateValidationErrors(validationState));
  }, [validationState]); // eslint-disable-line

  return {
    getAllErrors,
    getError,
    getFieldValid,
    isValid,
    resetValidationState,
    setValidationState,
    validate,
    validateIfTrue,
    validateAll,
    validateAllIfTrue,
    validationErrors,
    validationState,
  };
};
