import { any, compose, equals, ifElse } from "ramda";
import { trace } from "./utils";

const badName = {
  firstName: {
    isValid: false,
    errors: ['Rubber baby buggy bummpers']
  },
  lastName: {
    isValid: true,
    errors: []
  }
};

const goodName = {
  firstName: {
    isValid: true,
    errors: []
  },
  lastName: {
    isValid: true,
    errors: []
  }
};

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const mockAPI = async (status, payload) => {
  console.log('dispatched payload: ', payload)
  // reduce custom payload responses
  await delay(1000);
  return equals(status, 'error') ? badName : goodName;
};

export const handleMockApiResponse = (forceValidationState) =>
  compose(
    ifElse(
      compose(
        any(equals(false)),
        (data) => Object.keys(data).map(item => data[item].isValid)
      ),
      forceValidationState,
      trace('no errors!')
    ),
    trace('response recieved')
  );
