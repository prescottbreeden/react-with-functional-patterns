import React from 'react';
import {FlexRow} from '../layouts';

export const DebugForm = ({
  children,
  name = 'Debug Data',
  data,
}) => {
  return (
    <>
      <FlexRow>
        <div style={{ width: "50%" }}>
          {children}
        </div>
        <div style={{ width: "50%", marginLeft: "2rem" }}>
          <h2>{name} State</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </FlexRow>
    </>
  );
};

