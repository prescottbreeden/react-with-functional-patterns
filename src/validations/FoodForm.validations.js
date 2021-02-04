import {useValidation} from '../hooks/useValidation';
import {compose, lt as gt, length, prop, converge } from 'ramda';

export const FoodFormValidations = () => {
  return useValidation({
    isChecked: [
      {
        error: 'One Food must be checked.',
        validation: food => {
          return food.bambooLeaves ||
          food.bambooShoots ||
          food.bambooStems;
        }
      }
    ]
  })

}
