import { useValidation } from "@de-formed/react-validations";
import { compose, prop, equals } from "ramda";
import { cleanString, stringNotEmpty } from "../utils/validation";

export const NameValidations = () => {
  return useValidation({
    firstName: [
      {
        error: "First Name is required.",
        validation: compose(stringNotEmpty, prop("firstName")),
      },
      {
        error: "First Name cannot be bob.",
        validation: compose(
          equals(false),
          equals("bob"),
          cleanString,
          prop("firstName")
        ),
      },
    ],
    lastName: [
      {
        error: "Last Name is required.",
        validation: compose(stringNotEmpty, prop("lastName")),
      },
    ],
  });
};
