import { map, prop } from "ramda";
import React from "react";
import { FlexColumn, FlexRow } from "../layouts";
import { maybe } from 'fp-tools';

export const DynamicForm = ({
  addForm,
  disabled = false,
  entity,
  form,
  items,
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
          {maybe(items).map(map((data) => (
            <div style={{ display: "flex" }} key={prop(formKey, data)}>
              {React.createElement(form, {
                data,
                disabled,
                onChange,
                resetValidation,
                submitFailed,
              })}
              <div>
                <button disabled={disabled} onClick={() => removeForm(data)}>
                  Remove {entity}
                </button>
              </div>
            </div>
          ))).join()}
        </FlexColumn>
        <FlexRow>
          <button
            disabled={disabled}
            onClick={addForm}
            className="button form__btn--add"
          >
            Add {entity}
          </button>
        </FlexRow>
      </fieldset>
    </>
  );
};
