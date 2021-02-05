import { useState } from "react";

/*
 *  useToggle is mostly syntactic sugar to provide more restrictive use and
 *  declarative naming on the destructured statement, as well as provide the
 *  hook in a form that can be invoked with any argument that will be
 *  ignored and returned.
 *
 *  Solid use cases:
 *    - in any composed or piped situations
 *    - DOM events
 *    - anywhere you don't want to write out () => setState(bool)
 *
 *  @props
 *  toggle :: boolean
 *  setToggleTrue :: toggles state true and returns unused argument
 *  setToggleFalse :: toggles state false and returns unused argument
 *  setToggle :: original uncontrolled setter
 */
export const useToggle = (initialState) => {
  const [toggle, setToggle] = useState(initialState);
  const setToggleTrue = (_) => setToggle(true) || _;
  const setToggleFalse = (_) => setToggle(false) || _;
  return [toggle, setToggleTrue, setToggleFalse, setToggle];
};
