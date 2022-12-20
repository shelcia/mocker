import React, { useContext } from "react";
import { Box, Typography } from "@mui/material";
import { ThemeContext } from "../context/ThemeContext";
import { secondary } from "../themes/themeColors";

export const CustomTooltip = ({ active, payload, label }) => {
  const [darkTheme] = useContext(ThemeContext);

  //   console.log(active, payload, label);

  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: darkTheme ? secondary[900] : secondary[100],
          p: 2,
          boxShadow: "0px 7px 30px 3px rgba(0, 0, 0, 0.05)",
          borderRadius: 1,
          border: `2px solid ${payload[0]?.color}`,
        }}
      >
        <Typography component="p">
          {`${label} : ${payload[0].value}`} {payload[0]?.name}
        </Typography>
      </Box>
    );
  }

  return null;
};
