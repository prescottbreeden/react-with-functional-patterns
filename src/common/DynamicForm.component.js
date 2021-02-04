import React from 'react';
import { Box, Button, FlexColumn, FlexRow } from 'layouts';
import { idOrRandom } from 'utilities/general.utils';

export const DynamicForm = ({
  addForm,
  form,
  items,
  onChange,
  removeForm,
  resetValidation,
  submitFailed,
}) => {
  return (
    <>
      <FlexColumn>
        {items.map((data) => (
          <FlexRow key={idOrRandom(data)}>
            {React.createElement(form, {
              data,
              onChange,
              resetValidation,
              submitFailed,
            })}
            <Box style={{ alignSelf: 'flex-end' }}>
              <Button onClick={() => removeForm(data)}>Remove</Button>
            </Box>
          </FlexRow>
        ))}
      </FlexColumn>
      <FlexRow>
        <Button onClick={addForm} className="button form__btn--add">
          Add
        </Button>
      </FlexRow>
    </>
  );
};
