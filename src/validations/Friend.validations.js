import { useValidation } from "@de-formed/react-validations";
import { compose, defaultTo, length, lt as gt, prop, trim } from "ramda";
import { NameValidations } from "./Name.validations";

export const FriendValidations = () => {
  const { validateAll: validateName } = NameValidations();
  return useValidation({
    name: [
      {
        error: 'Please check the "Name" section for errors.',
        validation: compose(validateName, prop("name")),
      },
    ],
    lengthOfFriendship: [
      {
        error: "Length of Friendship is required.",
        validation: compose(
          gt(0),
          length,
          trim,
          defaultTo(""),
          prop("lengthOfFriendship")
        ),
      },
    ],
  });
};
