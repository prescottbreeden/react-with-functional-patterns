import { compose, cond as firstMatch } from 'ramda';
import React, { useState } from 'react';
import {emptyPanda} from '../entities/panda';
import { NameForm } from '../forms/Name.form';
import { through, trace } from '../utils';
import { NameValidations } from '../validations/nameform.validations';

export const CreatePanda = () => {
  const { validateAll } = NameValidations();
  const [submitFailed, setSubmitFailed] = useState(false);
  const [panda, setPanda] = useState(emptyPanda());

  // dispatchPayload :: Panda -> void
  const dispatchPayload = compose(
    trace('handling potential errors'),
    trace('sending payload'),
  );

  // onFailure :: Panda -> void
  const onFailure = through([
    trace('rendering front-end errors'),
    _ => setSubmitFailed(true)
  ]);

  // onSuccess :: Panda -> void
  const onSuccess = through([
    dispatchPayload,
    _ => setSubmitFailed(false)
  ]);

  // handleSubmit :: Panda -> fn(Panda)
  const handleSubmit = firstMatch([
    [validateAll, onSuccess],
    [_ => true, onFailure],
  ]);

  return (
    <>
      <h1>Let's make a panda!</h1>
      <NameForm
        data={panda}
        onChange={setPanda}
        submitFailed={submitFailed}
      />
      <button onClick={() => handleSubmit(panda)}>Submit</button>
      <div>{submitFailed ? "Data Invalid" : "Data Valid"}</div>
    </>
  );
};

