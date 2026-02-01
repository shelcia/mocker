import React from 'react';
import { Box } from '@mui/material';
import { Rings } from 'react-loader-spinner';

const Loading = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Box
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        display: 'flex',
      }}
    >
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
    </Box>
  );
};

export default Loading;

export const PartLoader = ({ children }: { children?: React.ReactNode }) => (
  <Box>
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
  </Box>
);
