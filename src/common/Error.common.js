import React from "react";

export const Error = ({ error }) => {
  return <>{error && <p role="alert">{error}</p>}</>;
};
