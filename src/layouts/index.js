import React from "react";

export const FlexColumn = (props) => {
  return (
    <div className="form__group" {...props}>
      {props.children}
    </div>
  );
};

export const FlexRow = (props) => {
  return (
    <div className="form__row" {...props}>
      {props.children}
    </div>
  );
};

export const Box = (props) => {
  return (
    <div className="form__box" {...props}>
      {props.children}
    </div>
  );
};

export const Error = (props) => {
  return (
    <p className="form__error" {...props}>
      {props.children}
    </p>
  );
};
