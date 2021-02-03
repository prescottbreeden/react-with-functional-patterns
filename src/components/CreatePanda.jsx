import { applyTo, compose, cond, curry, ifElse, map } from 'ramda';
import React, { useState } from 'react';
import { NameForm } from '../forms/Name.form';
import { trace } from '../utils';
import { NameValidations } from '../validations/nameform.validations';

export const CreatePanda = () => {
  const { validateAll } = NameValidations();
  const [submitFailed, setSubmitFailed] = useState(false);
  const [panda, setPanda] = useState({
    firstName: '',
    lastName: '',
    food: [],
    friend: {
      firstName: '',
      lastName: '',
      lengthOfFriendship: 0,
    },
  });

  // toggleSubmitFailed :: bool -> a -> a
  const toggleSubmitFailed = curry((bool, _) => {
    setSubmitFailed(bool);
  });

  // onSuccess :: Panda -> void
  const dispatchPayload = compose(
    trace('handling potential errors'),
    trace('sending payload'),
  );

  // onFailure :: Panda -> void
  const onFailure = compose(
    trace('rendering front-end errors'),
    toggleSubmitFailed(true)
  );

  // onSuccess :: Panda -> void
  const onSuccess = p => map(applyTo(p), [
    dispatchPayload,
    toggleSubmitFailed(false)
  ]);

  // handleSubmit :: () -> fn(Panda)
  const handleSubmit = () => cond([
    [validateAll, onSuccess],
    [_ => true, onFailure],
  ])(panda);

  // validatepayload :: () -> fn(Panda)
  const validatePayload = () => {
    return ifElse(validateAll, onSuccess, onFailure)(panda);
  };

  return (
    <>
      <h1>Let's make a panda!</h1>
      <NameForm
        data={panda}
        onChange={setPanda}
        submitFailed={submitFailed}
      />
      <button onClick={validatePayload}>Submit 1</button>
      <button onClick={handleSubmit}>Submit 2</button>
      <div>{submitFailed ? "Data Invalid" : "Data Valid"}</div>
    </>
  );
};

