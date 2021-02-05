import { __, compose, cond as firstMatch, prop, mergeRight, curry, map } from 'ramda';
import React, { useState } from 'react';
import { emptyPanda } from '../models/panda';
import { FoodForm } from '../forms/Food.form';
import { NameForm } from '../forms/Name.form';
import { randomString, set, through, trace } from '../utils';
import { PandaValidations } from '../validations/Panda.validations';
import { FriendForm } from '../forms/Friend.form';
import { DynamicForm } from '../common/DynamicForm.component';

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

  // get :: string -> panda[string]
  const get = prop(__, panda);

  // --[ model handlers ]------------------------------------------------------
  // handleNameChange :: Name -> void
  const handleNameChange = compose(
    setPanda,
    mergeRight(panda),
    set("name")
  );

  // handleFoodChange :: Food -> void
  const handleFoodChange = compose(
    setPanda,
    mergeRight(panda),
    set("food"),
  );

  // replaceItem :: [a] -> a -> [a]
  const replaceArrayItem = curry((list, property, b) => {
    return map(a => (a[property] === b[property] ? b : a), list);
  });

  // handleFriendChange :: Name -> void
  const handleFriendChange = compose(
    setPanda,
    mergeRight(panda),
    set('friends'),
    replaceArrayItem(get('friends'), 'id'),
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

  return (
    <section>
      <h1>Let's make a panda!</h1>
      <fieldset>
        <legend>CreatePanda.component.js</legend>
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
        <h2>Add friends for your panda</h2>
        <DynamicForm
          addForm={_ => null}
          entity="Friend"
          form={FriendForm}
          items={get('friends')}
          formKey="id"
          onChange={handleFriendChange}
          removeForm={_ => null}
          submitFailed={submitFailed}
        />
        <button onClick={() => handleSubmit(panda)}>Submit</button>
        {!isValid && validationErrors.map(error => 
          <p key={randomString()}>{error}</p>)}
      </fieldset>
    </section>
  );
};

