import React from "react";
import { Typography } from "@mui/material";
import { error, success } from "../themes/themeColors";

export const CustomTypoDisplay = ({ status, children }) => {
  return (
    <>
      <Typography
        align="center"
        bgcolor={status ? success.main : error.main}
        color={"#FFFFFF"}
        sx={{
          mt: 1,
          borderRadius: ".5em",
          px: 1.5,
          py: 1,
        }}
      >
        {children}
      </Typography>
    </>
  );
};
