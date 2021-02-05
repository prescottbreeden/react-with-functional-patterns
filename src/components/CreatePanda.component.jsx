import { __, compose, cond as firstMatch, prop, mergeRight, converge, always } from 'ramda';
import React, { useState } from 'react';
import { emptyPanda } from '../models/panda.model';
import { FoodForm } from '../forms/Food.form';
import { NameForm } from '../forms/Name.form';
import { randomString, replaceArrayItem, set, through, trace } from '../utils';
import { PandaValidations } from '../validations/Panda.validations';
import { FriendForm } from '../forms/Friend.form';
import { DynamicForm } from './DynamicForm.component';

export const CreatePanda = () => {
  // --[ dependencies ]--------------------------------------------------------
  const {
    isValid,
    validateAll,
    validateIfTrue,
    validationErrors,
  } = PandaValidations();

  // --[ local state ]---------------------------------------------------------
  const [submitFailed, setSubmitFailed] = useState(false);
  const [panda, setPanda] = useState(emptyPanda());

  // get :: string -> panda[string]
  const get = prop(__, panda);

  // validateChange :: DefaultInputEvent -> void
  const validateChange = name => compose(
    converge(
      validateIfTrue, [
        always(name),
        mergeRight(panda)
      ]
    ),
  );

  // updateModel :: Name | Food | [Friend] -> void
  // lambda expressions stored in dictionary by submodel names
  const updateModel = {
    name: set("name"),
    food: set("food"),
    friends: compose(
      set('friends'),
      replaceArrayItem(get('friends'), 'id'),
    ),
  };

  // handleChange :: DefaultInputEvent -> void
  const handleChange = name => through([
    validateChange(name),
    compose(
      setPanda,
      mergeRight(panda),
      updateModel[name]
    ),
  ]);

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
        <legend>CreatePanda.component.jsx</legend>
        <NameForm
          data={get('name')}
          onChange={handleChange('name')}
          submitFailed={submitFailed}
        />
        <FoodForm 
          data={get("food")}
          onChange={handleChange('food')}
          submitFailed={submitFailed}
        />
        <h2>Add friends for your panda</h2>
        <DynamicForm
          addForm={_ => null}
          entity="Friend"
          form={FriendForm}
          items={get('friends')}
          formKey="id"
          onChange={handleChange('friends')}
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

