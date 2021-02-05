import { useState, useEffect, useCallback } from 'react';
import { compose, curry, prop, all, map, reduce, converge, head, applyTo, equals } from 'ramda';

// helper
function isPropertyValid(property, validations) {
  return compose(prop('isValid'), prop(property))(validations);
}

/**
 * A hook that can be used to generate an object containing functions and
 * properties pertaining to the validation state provided.
 * @param validationSchema an object containing all the properties you want to validate
 * @returns validationObject { forceValidationState, getError, getAllErrors, getFieldValid, isValid, resetValidationState, validate, validateAll, validateIfTrue, validateOnBlur, validateOnChange, validationState }
 */
export const useValidation = (validationSchema) => {
  // -- Build Validation State Object -------------------------------------
  const createValidationsState = (schema) => {
    return reduce(
      (acc, key) => ({
        ...acc,
        [key]: {
          isValid: true,
          errors: [],
        },
      }),
      {},
      Object.keys(schema),
    );
  };

  // -- isValid and validationState ---------------------------------------
  const [isValid, setIsValid] = useState(true);
  const [validationState, setValidationState] = useState(
    createValidationsState(validationSchema),
  );
  const [validationErrors, setValidationErros] = useState([]);

  /**
   *  Resets the validation state.
   */
  const resetValidationState = () =>
    compose(setValidationState, createValidationsState)(validationSchema);

  /**
   *  Overrides the existing validation state with another.
   *  @param newValidationState ValidationState
   */
  const forceValidationState = (newValidationState) => {
    setValidationState(newValidationState);
  };

  /**
   * Executes the value against all provided validation functions and updates
   * the validation state.
   * @param key string the name of the property being validated
   * @return true/false validation
   */
  const runAllValidators = (property, state) => {
    // runValidator :: ValidationProp<S> -> boolean
    const runValidator = compose(
      applyTo(state),
      prop('validation'),
    );
    const bools = map(
      runValidator,
      prop(property, validationSchema),
    );
    const allValidationsValid = all(equals(true), bools);
    const errors = bools.reduce((acc, curr, idx) => {
      const errorOf = compose(
      prop('error'), prop(idx), prop(property));
      return curr ? acc : [...acc, errorOf(validationSchema)];
    }, []);
    return {
      [property]: {
        isValid: allValidationsValid,
        errors: allValidationsValid ? [] : errors,
      },
    };
  };

  /**
   * Executes a validation function on a value and updates the validation state.
   * @param property string the name of the property being validated
   * @return boolean
   */
  const validate = curry((property, state) => {
    if (validationSchema[property]) {
      const validations = runAllValidators(property, state);
      setValidationState({ ...validationState, ...validations });
      return isPropertyValid(property, validations);
    }
    return true;
  });

  /**
   * Takes a unique data set and runs them against the defined schema. Only use
   * if you need to run validations on data where the validation props are
   * unable to follow the names of the properties of an object. Will return a
   * boolean and update validation state.
   * @param customValidations CustomValidation[]
   * @return boolean
   */
  const validateCustom = customValidations => {
    const zip = converge(runAllValidators, [
      prop('key'),
      prop('state'),
    ]);
    const state = reduce(
      (acc, current) => {
        return {
          ...acc,
          ...zip(current),
        };
      },
      {},
      customValidations,
    );
    setValidationState(state);
    return allValid(state);
  };

  /**
   * Updates the validation state if the validation succeeds.
   * @param key string the name of the property being validated
   * @return boolean
   */
  const validateIfTrue = curry((property, state) => {
    if (validationSchema[property]) {
      const validations = runAllValidators(property, state);
      if (isPropertyValid(property, validations)) {
        setValidationState({ ...validationState, ...validations });
      }
      return isPropertyValid(property, validations);
    }
    return true;
  });

  /**
   * Create a new onBlur function that calls validate on a property matching the
   * name of the event whenever a blur event happens.
   * @param state the data controlling the form
   * @return function :: (event: any) => any
   */
  const validateOnBlur = curry((state, event) => {
    const { target: { value, name } } = event;
    validate(name, { ...state, [name]: value });
  });

  /**
   * Create a new onChange function that calls validateIfTrue on a property
   * matching the name of the event whenever a change event happens.
   * @param onChange function to handle onChange events
   * @param state the data controlling the form
   * @return function :: (event: any) => any
   */
  const validateOnChange = curry((onChange, state) => event => {
    const { target: { value, name } } = event;
    validateIfTrue(name, { ...state, [name]: value });
    return onChange(event);
  });

  /**
   * Runs all validations against an object with all values and updates/returns
   * isValid state.
   * @param state any an object that contains all values to be validated
   * @param props string[] property names to check (optional)
   * @return boolean
   */
  const validateAll = (state, props = Object.keys(validationSchema)) => {
    const newState = reduce((acc, property) => {
        return {
          ...acc,
          ...runAllValidators(property, state)
        };
      },
      {},
      props
    );
    setValidationState({ ...validationState, ...newState });
    return allValid(newState);
  };

  /**
   * Get the current error stored for a property on the validation object.
   * @param property the name of the property to retrieve
   * @return string
   */
  const getAllErrors = (property, vState = validationState) => {
    if (validationSchema[property]) {
      const val = compose(prop('errors'), prop(property));
      return val(vState);
    }
    return [];
  };

  /**
   * Get the current error stored for a property on the validation object.
   * @param property the name of the property to retrieve
   * @return string
   */
  const getError = (property, vState = validationState) => {
    if (validationSchema[property]) {
      const val = compose(head, prop('errors'), prop(property));
      return val(vState) ? val(vState) : '';
    }
    return '';
  };

  /**
   * Get the current valid state stored for a property on the validation object.
   * If the property does not exist on the validationSchema getFieldValid will
   * return true by default.
   * @param property the name of the property to retrieve
   * @return boolean
   */
  const getFieldValid = (property, vState = validationState) => {
    if (validationSchema[property]) {
      const val = compose(prop('isValid'), prop(property));
      return val(vState);
    }
    return true;
  };

  // -- helper to determine if a new validation state is valid ------------
  const allValid = (state) => {
    return reduce((acc , curr) => {
        return acc ? isPropertyValid(curr, state) : acc;
      },
      true,
      Object.keys(state),
    );
  };

  // -- helper to build array of errors when validation state is invalid ---
  const generateValidationErrors = (state) => {
    return reduce((acc, curr) => 
      getError(curr) ? [...acc, getError(curr)] : acc,
      [],
      Object.keys(state),
    );
  };

  // -- memoized functions to update state on change detection -------------
  const updateIsValid = useCallback(allValid, [validationState]);
  const updateErrors = useCallback(generateValidationErrors, [validationState]);

  useEffect(() => {
    setIsValid(updateIsValid(validationState));
    setValidationErros(updateErrors(validationState));
  }, [validationState, updateIsValid]); // eslint-disable-line

  return {
    forceValidationState,
    getAllErrors,
    getError,
    getFieldValid,
    isValid,
    resetValidationState,
    validate,
    validateAll,
    validateCustom,
    validateIfTrue,
    validateOnBlur,
    validateOnChange,
    validationErrors,
    validationState,
  };
};
