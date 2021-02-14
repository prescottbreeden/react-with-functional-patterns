import { useValidation } from "@de-formed/react-validations";
import { all, compose, equals, map, prop } from "ramda";
import { NameValidations } from "./Name.validations";
import { FoodFormValidations } from "./FoodForm.validations";
import { FriendValidations } from "./Friend.validations";

export const PandaValidations = () => {
  const { validateAll: validateName } = NameValidations();
  const { validateAll: validateFood } = FoodFormValidations();
  const { validateAll: validateFriend } = FriendValidations();
  return useValidation({
    name: [
      {
        error: 'Please check the "Name" section for errors.',
        validation: compose(validateName, prop("name")),
      },
    ],
    food: [
      {
        error: 'Please check the "Food" section for errors.',
        validation: compose(validateFood, prop("food")),
      },
    ],
    friends: [
      {
        error: 'Please check the "Friend" section for errors.',
        validation: compose(
          all(equals(true)),
          map(validateFriend),
          prop("friends")
        ),
      },
    ],
  });
};
