import * as R from "ramda";
import React, { useEffect } from "react";
import { FoodForm } from "../forms/Food.form";
import { NameForm } from "../forms/Name.form";
import { FriendForm } from "../forms/Friend.form";
import { DynamicForm } from "../common/DynamicForm.common";
import { replaceArrayItem, through } from "../utils/general";
import { maybe } from "../utils/maybe";
import { PandaValidations } from "../validations/Panda.validations";
import { emptyFriend } from "../models/friend.model";

export const PandaForm = ({
  onChange,
  data,
  disabled,
  submitFailed,
  overrideValidationState,
}) => {
  // --[ dependencies ]--------------------------------------------------------
  const v = PandaValidations();

  // --[ component logic ]-----------------------------------------------------
  // get :: string -> data[string]
  const get = R.prop(R.__, data);

  // updateModel[model] :: Partial<Panda> -> { Partial<Panda> }
  const updateModel = {
    name: R.assoc("name", R.__, data),
    food: R.assoc("food", R.__, data),
    friends: R.compose(
      R.assoc("friends", R.__, data),
      replaceArrayItem(get("friends"), "id")
    ),
  };

  // validateChange :: string -> Partial<Panda> -> void
  const validateChange = (name) =>
    R.converge(v.validateIfTrue, [R.always(name), R.mergeRight(data)]);

  // handleChange :: string -> Partial<Panda> -> void
  const handleChange = (name) =>
    through([validateChange(name), R.compose(onChange, updateModel[name])]);

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
      v.validateAll(data);
      maybe(overrideValidationState).map(v.setValidationState);
    }
  }, [submitFailed, overrideValidationState]); // eslint-disable-line

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
