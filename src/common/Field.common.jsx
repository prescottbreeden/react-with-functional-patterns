import { cond as firstMatch, curry, equals } from "ramda";
import React from "react";
import { DefaultCheckbox } from "./DefaultCheckbox.common.jsx";
import { DefaultInput } from "./DefaultInput.common.jsx";

export const Field = (props) => {
  const buildComponent = curry((component, props, _) => {
    return React.createElement(component, { ...props });
  });

  const inputType = firstMatch([
    [equals("text"), buildComponent(DefaultInput, props)],
    [equals("checkbox"), buildComponent(DefaultCheckbox, props)],
    [(_) => true, buildComponent(DefaultInput, props)],
  ]);
  return inputType(props.type);
};
