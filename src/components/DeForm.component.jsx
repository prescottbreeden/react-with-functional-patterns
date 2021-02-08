import { compose, cond as firstMatch, equals, path, prop } from "ramda";
import React, { useEffect, useState } from "react";
import { randomString, through, trace } from "../utils";
import { useToggle } from "../hooks/useToggle.hook";
import { FlexRow } from "../layouts";
import { Field } from "../common/Field.common";
import { Form } from "../App";

export const DeForm = ({
  children,
  data,
  name,
  onChange,
  onSubmit,
  validationObject,
}) => {
  // --[ dependencies ]--------------------------------------------------------
  const {
    forceValidationState,
    isValid,
    validateAll,
    validateAllIfTrue,
    validationErrors,
  } = validationObject;

  // --[ local state ]---------------------------------------------------------
  const [
    hasValidationErrors,
    activateValidationErrors,
    deactivateValidationErrors,
  ] = useToggle(false);

  // --[ component logic ]-----------------------------------------------------

  /* prettier-ignore */
  // handleChange :: data -> void
  const handleChange = through([
    validateAllIfTrue,
    onChange
  ]);

  /* prettier-ignore */
  // onFailure :: data -> void
  const onFailure = through([
    trace("rendering front-end errors"),
    activateValidationErrors,
  ]);

  /* prettier-ignore */
  // onSuccess :: data -> void
  const onSuccess = through([
    onSubmit,
    deactivateValidationErrors
  ]);

  // handleSubmit :: data -> fn(data)
  const handleSubmit = firstMatch([
    [validateAll, onSuccess],
    [(_) => true, onFailure],
  ]);

  const isForm = compose(equals(true), path(["props", "form"]));
  const applyProps = (fn) => (child) =>
    fn(child, { data, onChange: handleChange });

  const mapChildren = (children, fn) => {
    return React.Children.map(children, (child) => {
      const name = child.props.name;
      console.log(child.props);
      const value = data[name];
      const toRender = firstMatch([
        [compose(equals(Field), prop("type")), (child) => fn(child, { value })],
        [isForm, applyProps(fn)],
        [(_) => true, (child) => fn(child)],
      ]);
      return child.props.children
        ? mapChildren(child.props.children, fn)
        : toRender(child);
    });
  };

  return (
    <section>
      <fieldset>
        <legend>{name} Form</legend>
        <FlexRow>
          <div style={{ width: "50%" }}>
            {mapChildren(children, React.cloneElement)}
          </div>
          <div style={{ width: "50%", marginLeft: "2rem" }}>
            <h2>DeForm State</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        </FlexRow>
        <button onClick={() => handleSubmit(data)}>Submit</button>
        {!isValid &&
          validationErrors.map((error) => <p key={randomString()}>{error}</p>)}
      </fieldset>
    </section>
  );
};
