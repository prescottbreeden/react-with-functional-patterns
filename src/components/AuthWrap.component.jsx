import React from "react";

export const AuthWrap = (props) => {
  const disabled = props.authorized === false;
  const mapChildren = (children, fn) => {
    return React.Children.map(children, (child) => {
      const disable = (child) => fn(child, { ...child.props, disabled });
      return child.props.children
        ? mapChildren(child.props.children, fn)
        : disable(child);
    });
  };

  return mapChildren(props.children, React.cloneElement);
};
