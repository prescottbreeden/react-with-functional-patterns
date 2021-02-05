import {prop} from 'ramda';
import React from 'react';
import { FlexColumn, FlexRow } from '../layouts';

export const DynamicForm = ({
  addForm,
  entity,
  form,
  items = [],
  formKey,
  onChange,
  removeForm,
  resetValidation,
  submitFailed,
}) => {

  return (
    <>
      <fieldset>
        <legend>DynamicForm.component.jsx</legend>
        <FlexColumn>
          {items.map((data) => (
            <div style={{ display: 'flex' }} key={prop(formKey, data)}>
              {React.createElement(form, {
                data,
                onChange,
                resetValidation,
                submitFailed,
              })}
              <div>
                <button onClick={() => removeForm(data)}>
                  Remove {entity}
                </button>
              </div>
            </div>
          ))}
        </FlexColumn>
        <FlexRow>
          <button onClick={addForm} className="button form__btn--add">
            Add {entity}
          </button>
        </FlexRow>
      </fieldset>
    </>
  );
};
