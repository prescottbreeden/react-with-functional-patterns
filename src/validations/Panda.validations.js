import {useValidation} from '../hooks/useValidation';
import {compose, lt as gt, length, prop, equals, trim } from 'ramda';
import {NameValidations} from './Name.validations';
import {FoodFormValidations} from './FoodForm.validations';

export const PandaValidations = () => {
  const { validateAll: validateName } = NameValidations();
  const { validateAll: validateFood } = FoodFormValidations();
  return useValidation({
    name: [
      {
        error: 'Please check the "Name" section for errors.',
        validation: compose(
          validateName,
          prop('name')
        ),
      }
    ],
    food: [
      {
        error: 'Please check the "Food" section for errors.',
        validation: compose(
          validateFood,
          prop('food')
        ),
      }
    ],
  })
}
