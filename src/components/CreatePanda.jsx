import { __, compose, cond as firstMatch, prop, mergeRight } from 'ramda';
import React, { useState } from 'react';
import {emptyPanda} from '../models/panda';
import {FoodForm} from '../forms/Food.form';
import { NameForm } from '../forms/Name.form';
import { set, through, trace } from '../utils';
import {PandaValidations} from '../validations/Panda.validations';

export const CreatePanda = () => {
  // --[ dependencies ]--------------------------------------------------------
  const {
    isValid,
    validateAll,
    validationErrors,
  } = PandaValidations();

  // --[ local state ]---------------------------------------------------------
  const [submitFailed, setSubmitFailed] = useState(false);
  const [panda, setPanda] = useState(emptyPanda());

  // --[ model handlers ]------------------------------------------------------
  // handleFoodChange :: Food -> void
  const handleFoodChange = compose(
    setPanda,
    mergeRight(panda),
    set("food")
  );

  // handleFoodChange :: Name -> void
  const handleNameChange = compose(
    setPanda,
    mergeRight(panda),
    set("name")
  );

  // --[ submission logic ]----------------------------------------------------
  // dispatchPayload :: Panda -> void
  const dispatchPayload = compose(
    trace('handling potential errors'),
    trace('sending payload'),
  );

  // onFailure :: Panda -> void
  const onFailure = through([
    trace('rendering front-end errors'),
    () => setSubmitFailed(true)
  ]);

  // onSuccess :: Panda -> void
  const onSuccess = through([
    dispatchPayload,
    () => setSubmitFailed(false)
  ]);

  // handleSubmit :: Panda -> fn(Panda)
  const handleSubmit = firstMatch([
    [validateAll, onSuccess],
    [_ => true, onFailure],
  ]);

  const get = prop(__, panda);

  return (
    <>
      <h1>Let's make a panda!</h1>
      <NameForm
        data={get('name')}
        onChange={handleNameChange}
        submitFailed={submitFailed}
      />
      <FoodForm 
        data={get("food")}
        onChange={handleFoodChange}
        submitFailed={submitFailed}
      />
      <button onClick={() => handleSubmit(panda)}>Submit</button>
      {!isValid && (
        <>
          <div>
            {validationErrors.map(error =>
              <p key={Math.random()}>{error}</p>)}
          </div>
        </>
      )}
    </>
  );
};

