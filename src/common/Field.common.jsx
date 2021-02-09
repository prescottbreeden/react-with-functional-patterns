import { cond as firstMatch, curry, equals } from "ramda";
import React from "react";
import { FormCheckbox } from "./FormCheckbox.common.jsx";
import { FormInput } from "./FormInput.common.jsx";

export const Field = (props) => {
  const buildComponent = curry((component, props, _) => {
    return React.createElement(component, { ...props });
  });

  const inputType = firstMatch([
    [equals("text"), buildComponent(FormInput, props)],
    [equals("checkbox"), buildComponent(FormCheckbox, props)],
    [(_) => true, buildComponent(FormInput, props)],
  ]);
  return inputType(props.type);
};
