import React from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";

export const CustomTabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export const CustomTabs = ({ value, handleChange, items = [] }) => {
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs value={value} onChange={handleChange} aria-label="navigation tabs">
        {items.map((item, idx) => (
          <Tab label={item} {...a11yProps(idx)} key={idx} />
        ))}
      </Tabs>
    </Box>
  );
};
