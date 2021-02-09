import { useValidation } from "../hooks/useValidation.hook";
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
