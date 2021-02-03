import {curry} from "ramda";
import {useState} from "react"

export const useCurriedState = val => {
  const [state, setState] = useState(val);

  // updateValue :: bool -> a -> a
  const _setVal = curry((x, _) => {
    setState(x);
  });

  return [ state, _setVal ];
}
