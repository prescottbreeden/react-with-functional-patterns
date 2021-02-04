import { useValidation } from '../hooks/useValidation';
import { prop, anyPass } from 'ramda';

export const FoodFormValidations = () => {
  return useValidation({
    isChecked: [
      {
        error: 'At least one Food must be checked.',
        validation: anyPass([
          prop('bambooLeaves'),
          prop('bambooShoots'),
          prop('bambooStems'),
        ]),
      }
    ]
  })

}
