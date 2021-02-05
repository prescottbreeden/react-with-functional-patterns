import {
  __,
  compose,
  cond as firstMatch,
  prop,
  mergeRight,
  converge,
  always,
} from "ramda";
import React, { useState } from "react";
import { emptyPanda } from "../models/panda.model";
import { FoodForm } from "../forms/Food.form";
import { NameForm } from "../forms/Name.form";
import { randomString, replaceArrayItem, set, through, trace } from "../utils";
import { PandaValidations } from "../validations/Panda.validations";
import { FriendForm } from "../forms/Friend.form";
import { DynamicForm } from "./DynamicForm.component";
import { useToggle } from "../hooks/useToggle.hook";

export const CreatePanda = () => {
  // --[ dependencies ]--------------------------------------------------------
  const {
    isValid,
    validateAll,
    validateIfTrue,
    validationErrors,
  } = PandaValidations();

  // --[ local state ]---------------------------------------------------------
  const [panda, _setPanda] = useState(emptyPanda());
  const [
    hasValidationErrors,
    activateValidationErrors,
    deactivateValidationErrors,
  ] = useToggle(false);

  // --[ component logic ]-----------------------------------------------------
  // get :: string -> panda[string]
  const get = prop(__, panda);

  // validateChange :: Name | Food | [Friend] -> void
  const validateChange = (name) =>
    compose(converge(validateIfTrue, [always(name), mergeRight(panda)]));

  // updateModel :: Name | Food | [Friend] -> { Name | Food | [Friend] }
  // lambda expressions stored in dictionary by submodel names
  const updateModel = {
    name: set("name"),
    food: set("food"),
    friends: compose(set("friends"), replaceArrayItem(get("friends"), "id")),
  };

  // handleChange :: string -> Name | Food | [Friend] -> void
  const handleChange = (name) =>
    through([
      validateChange(name),
      compose(_setPanda, mergeRight(panda), updateModel[name]),
    ]);

  // --[ submission logic ]----------------------------------------------------
  // dispatchPayload :: Panda -> void
  const dispatchPayload = compose(
    trace("handling potential errors"),
    trace("sending payload")
  );

  // onFailure :: Panda -> void
  const onFailure = through([
    trace("rendering front-end errors"),
    activateValidationErrors,
  ]);

  // onSuccess :: Panda -> void
  const onSuccess = through([dispatchPayload, deactivateValidationErrors]);

  // handleSubmit :: Panda -> fn(Panda)
  const handleSubmit = firstMatch([
    [validateAll, onSuccess],
    [(_) => true, onFailure],
  ]);

  return (
    <section>
      <h1>Let's make a panda!</h1>
      <fieldset>
        <legend>CreatePanda.component.jsx</legend>
        <NameForm
          data={get("name")}
          onChange={handleChange("name")}
          submitFailed={hasValidationErrors}
        />
        <FoodForm
          data={get("food")}
          onChange={handleChange("food")}
          submitFailed={hasValidationErrors}
        />
        <h2>Add friends for your panda</h2>
        <DynamicForm
          addForm={(_) => null}
          entity="Friend"
          form={FriendForm}
          items={get("friends")}
          formKey="id"
          onChange={handleChange("friends")}
          removeForm={(_) => null}
          submitFailed={hasValidationErrors}
        />
        <button onClick={() => handleSubmit(panda)}>Submit</button>
        {!isValid &&
          validationErrors.map((error) => <p key={randomString()}>{error}</p>)}
      </fieldset>
    </section>
  );
};
