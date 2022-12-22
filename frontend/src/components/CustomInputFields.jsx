import React, { useState } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export const CustomPwdField = ({
  field = "password",
  label = "password",
  handleBlur = () => {},
  handleChange = () => {},
  values,
  touched,
  errors,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  return (
    <TextField
      label={label}
      size="small"
      type={showPassword ? "text" : "password"}
      fullWidth
      name={field}
      onBlur={handleBlur}
      onChange={handleChange}
      value={values[field] || ""}
      error={Boolean(touched[field] && errors[field])}
      helperText={touched[field] && errors[field]}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
