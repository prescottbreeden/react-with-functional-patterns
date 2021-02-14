import { useValidation } from "@de-formed/react-validations";
import { always } from 'ramda';

export const DefaultValidations = () => {
  return useValidation({
    anything: [
      {
        error: "",
        validation: always(true)
      },
    ],
  });
};
