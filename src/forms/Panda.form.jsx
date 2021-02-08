import { __, compose, prop, mergeRight, converge, always } from "ramda";
import React, { useEffect } from "react";
import { maybe, replaceArrayItem, set, through } from "../utils";
import { FoodForm } from "../forms/Food.form";
import { NameForm } from "../forms/Name.form";
import { FriendForm } from "../forms/Friend.form";
import { DynamicForm } from "../components/DynamicForm.component";
import { PandaValidations } from "../validations/Panda.validations";
import { emptyFriend } from "../models/friend.model";

export const PandaForm = ({
  onChange,
  data,
  disabled,
  submitFailed,
  validationState,
}) => {
  // --[ dependencies ]--------------------------------------------------------
  const {
    forceValidationState,
    validateAll,
    validateIfTrue,
  } = PandaValidations();

  // --[ component logic ]-----------------------------------------------------
  // get :: string -> data[string]
  const get = prop(__, data);

  // updateModel[model] :: Partial<Panda> -> { Partial<Panda> }
  const updateModel = {
    name: set("name"),
    food: set("food"),
    friends: compose(set("friends"), replaceArrayItem(get("friends"), "id")),
  };

  // validateChange :: string -> Partial<Panda> -> void
  const validateChange = (name) =>
    converge(validateIfTrue, [always(name), mergeRight(data)]);

  // handleChange :: string -> Partial<Panda> -> void
  const handleChange = (name) =>
    through([
      validateChange(name),
      compose(onChange, mergeRight(data), updateModel[name]),
    ]);

  // addFriend :: () -> void
  const addFriend = (_) =>
    onChange({
      ...data,
      friends: [...get("friends"), emptyFriend()],
    });

  // removeFriend :: friend -> void
  const removeFriend = (friend) => {
    const friends = get("friends").filter((f) => f.id !== friend.id);
    onChange({ ...data, friends });
  };

  // --[ lifecycle ]-----------------------------------------------------------
  useEffect(() => {
    if (submitFailed) {
      validateAll(data);
      maybe(validationState).map(forceValidationState);
    }
  }, [submitFailed]); // eslint-disable-line

  return (
    <>
      <fieldset>
        <legend>Panda.form.jsx</legend>
        <NameForm
          data={get("name")}
          disabled={disabled}
          onChange={handleChange("name")}
          submitFailed={submitFailed}
        />
        <FoodForm
          data={get("food")}
          disabled={disabled}
          onChange={handleChange("food")}
          submitFailed={submitFailed}
        />
        <h2>Add friends for your panda</h2>
        <DynamicForm
          addForm={addFriend}
          disabled={disabled}
          entity="Friend"
          form={FriendForm}
          items={get("friends")}
          formKey="id"
          onChange={handleChange("friends")}
          removeForm={removeFriend}
          submitFailed={submitFailed}
        />
      </fieldset>
    </>
  );
};
