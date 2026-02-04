import React from 'react';

import { ColorRing, Rings } from 'react-loader-spinner';

const Loading = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Rings
        color="#2499EF"
        height={150}
        width={150}
        wrapperStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
      {children}
    </div>
  );
};

export default Loading;

export const PartLoader = ({ children }: { children?: React.ReactNode }) => (
  <div>
    <Rings
      color="#2499EF"
      height={150}
      width={150}
      wrapperStyle={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
    {children}
  </div>
);

export const CustomLoaderButton = () => {
  return <ColorRing visible={true} height="30" width="30" />;
};
