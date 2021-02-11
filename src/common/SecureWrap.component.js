import React from "react";
import { always, compose, cond as firstMatch, equals, includes, prop } from 'ramda';

const isDisabled = firstMatch([
  [compose(equals('admin'), prop('role')), always(false)],
  [compose(includes('full'), prop('access')), always(false)],
  [compose(includes('write'), prop('access')), always(false)],
  [always(true), always(true)],
]);

const isHidden = firstMatch([
  [compose(equals([]), prop('access')), always(true)],
  [always(true), always(false)],
]);

export const SecureWrap = (props) => {
  const disabled = isDisabled(props.permission)
  const mapChildren = (children, fn) => {
    return React.Children.map(children, (child) => {
      const disable = (child) => fn(child, { ...child.props, disabled });
      return child.props.children
        ? mapChildren(child.props.children, fn)
        : disable(child);
    });
  };

  return isHidden(props.permission)
    ? <p>
        You do not have access to view this page. If you believe this is a
        mistake, please contact a site administrator.
      </p>
    : mapChildren(props.children, React.cloneElement);
};
