import {useValidation} from '../hooks/useValidation';
import {compose, lt as gt, length, prop, equals } from 'ramda';

export const NameValidations = () => {
  return useValidation({
    firstName: [
      {
        error: 'First Name is required.',
        validation: compose(
          gt(0),
          length,
          prop('firstName')
        )
      },
      {
        error: 'First Name cannot be bob.',
        validation: compose(
          equals(false),
          equals('bob'),
          prop('firstName')
        )
      },
    ],
    lastName: [
      {
        error: 'Last Name is required.',
        validation: compose(
          gt(0),
          length,
          prop('lastName')
        )
      }
    ],
  })

}
