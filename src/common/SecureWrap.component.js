import React from "react";
import * as R from "ramda";

const isDisabled = R.cond([
  [R.compose(R.equals("admin"), R.prop("role")), R.always(false)],
  [R.compose(R.includes("full"), R.prop("access")), R.always(false)],
  [R.compose(R.includes("write"), R.prop("access")), R.always(false)],
  [R.always(true), R.always(true)],
]);

const isHidden = R.cond([
  [R.compose(R.equals([]), R.prop("access")), R.always(true)],
  [R.always(true), R.always(false)],
]);

export const SecureWrap = (props) => {
  const disabled = isDisabled(props.permission);
  const mapChildren = (children, fn) => {
    return React.Children.map(children, (child) => {
      // disable :: child element -> child element
      const disable = (child) => fn(child, { ...child.props, disabled });
      return child.props.children
        ? mapChildren(child.props.children, fn)
        : disable(child);
    });
  };

  return isHidden(props.permission) ? (
    <p>
      You do not have access to view this page. If you believe this is a
      mistake, please contact a site administrator.
    </p>
  ) : (
    mapChildren(props.children, React.cloneElement)
  );
};
