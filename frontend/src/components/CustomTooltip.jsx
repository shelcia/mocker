import React from "react";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { secondary } from "../themes/themeColors";

export const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color:
      theme.palette.mode === "dark"
        ? theme.palette.common.white
        : secondary[900],
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.common.white
        : secondary[900],
    color:
      theme.palette.mode === "dark"
        ? secondary[900]
        : theme.palette.common.white,
    boxShadow: theme.shadows[2],
    fontSize: 11,
  },
}));
