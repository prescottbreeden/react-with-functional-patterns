import {useValidation} from '../hooks/useValidation';
import {compose, lt as gt, length, prop, equals, trim, defaultTo } from 'ramda';

export const NameValidations = () => {
  return useValidation({
    firstName: [
      {
        error: 'First Name is required.',
        validation: compose(
          gt(0),
          length,
          trim,
          defaultTo(''),
          prop('firstName')
        )
      },
      {
        error: 'First Name cannot be bob.',
        validation: compose(
          equals(false),
          equals('bob'),
          trim,
          defaultTo(''),
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
          trim,
          defaultTo(''),
          prop('lastName')
        )
      }
    ],
  })

}
