import React, { useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { getIn, type FormikErrors, type FormikTouched } from 'formik';

type CustomPwdFieldProps<T extends Record<string, any>> = {
  field?: keyof T & string;
  label?: string;

  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  values: T;
  touched: FormikTouched<T>;
  errors: FormikErrors<T>;
};

export function CustomPwdField<T extends Record<string, any>>({
  field = 'password',
  label = 'password',
  handleBlur,
  handleChange,
  values,
  touched,
  errors,
}: CustomPwdFieldProps<T>) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const hasError = Boolean(getIn(touched, field) && getIn(errors, field));
  const errorText = hasError ? String(getIn(errors, field)) : undefined;

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  return (
    <TextField
      label={label}
      size="small"
      type={showPassword ? 'text' : 'password'}
      fullWidth
      name={field}
      onBlur={handleBlur}
      onChange={handleChange}
      value={values[field] || ''}
      error={Boolean(touched[field] && errors[field])}
      helperText={errorText}
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
}
