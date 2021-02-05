import { __, compose, prop, mergeRight, converge, always } from "ramda";
import React, { useEffect } from "react";
import { replaceArrayItem, set, through, trace } from "../utils";
import { FoodForm } from "../forms/Food.form";
import { NameForm } from "../forms/Name.form";
import { FriendForm } from "../forms/Friend.form";
import { DynamicForm } from "../components/DynamicForm.component";
import { PandaValidations } from "../validations/Panda.validations";
import { emptyFriend } from "../models/friend.model";

export const PandaForm = ({ onChange, data, submitFailed }) => {
  const { validateAll, validateIfTrue } = PandaValidations();

  // get :: string -> data[string]
  const get = prop(__, data);

  // validateChange :: Name | Food | [Friend] -> void
  const validateChange = (name) =>
    compose(converge(validateIfTrue, [always(name), mergeRight(data)]));

  // updateModel :: Name | Food | [Friend] -> { Name | Food | [Friend] }
  // lambda expressions stored in dictionary by submodel names
  const updateModel = {
    name: set("name"),
    food: set("food"),
    friends: compose(set("friends"), replaceArrayItem(get("friends"), "id")),
  };

  // handleChange :: string -> Name | Food | [Friend] -> void
  const handleChange = (name) =>
    through([validateChange(name), compose(onChange, updateModel[name])]);

  // addFriend :: () -> void
  const _addFriend = (_) =>
    onChange({
      ...data,
      friends: [...data.friends, emptyFriend()],
    });

  // removeFriend :: friend -> void
  const _removeFriend = (friend) => {
    const friends = data.friends.filter((f) => f.id !== friend.id);
    onChange({ ...data, friends });
  };

  useEffect(() => {
    submitFailed && validateAll(data);
  }, [submitFailed]); // eslint-disable-line

  return (
    <>
      <fieldset>
        <legend>Panda.form.jsx</legend>
        <NameForm
          data={get("name")}
          onChange={handleChange("name")}
          submitFailed={submitFailed}
        />
        <FoodForm
          data={get("food")}
          onChange={handleChange("food")}
          submitFailed={submitFailed}
        />
        <h2>Add friends for your panda</h2>
        <DynamicForm
          addForm={_addFriend}
          entity="Friend"
          form={FriendForm}
          items={get("friends")}
          formKey="id"
          onChange={handleChange("friends")}
          removeForm={_removeFriend}
          submitFailed={submitFailed}
        />
      </fieldset>
    </>
  );
};
