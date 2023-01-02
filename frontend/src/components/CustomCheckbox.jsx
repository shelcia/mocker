import React, { useContext } from "react";
import { Checkbox } from "@mui/material";
import { ThemeContext } from "../context/ThemeContext";

const CustomCheckbox = ({ handleChecked, id }) => {
  const [darkTheme] = useContext(ThemeContext);

  return (
    <>
      <Checkbox
        sx={{
          color: darkTheme ? "#59BCF5" : "#dbdbdb",
          ":hover": { color: darkTheme ? "#e8e8e8" : "#59BCF5" },
        }}
        onChange={(e) => {
          handleChecked(e, id);
        }}
      />
    </>
  );
};

export default CustomCheckbox;
