import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { apiAuth } from "../../services/models/authModel";
import { toast } from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import { ColorRing } from "react-loader-spinner";
import { InputAdornment, IconButton } from "@mui/material";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const initialValues = {
    email: "",
    password: "",
    submit: null,
  }; // form field value validation schema

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Must be a valid email")
      .max(255)
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password should be of minimum 6 characters length")
      .required("Password is required"),
  });

  const { errors, values, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit: (values) => {
        setLoading(true);
        loginUser(values.email, values.password);
      },
    });

  const loginUser = (email, password) => {
    const body = {
      email: email,
      password: password,
    };

    apiAuth.post(body, "signin").then((res) => {
      if (res.status === "200") {
        localStorage.setItem('MockAPI-Token',
          res.message.token)
        navigate(`/${res.message.userId}`);
        toast.success("Login successful");
      } else if (res.status === "400") {
        toast.error(res.message);
      } else {
        toast.error("Error");
      }
      setLoading(false);
    });
  };

  return (
    <React.Fragment>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Login
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        style={{
          width: "100%",
        }}
      >
        <TextField
          label="email"
          size="small"
          type="email"
          sx={{ mb: 2 }}
          fullWidth
          name="email"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.email || ""}
          error={Boolean(touched.email && errors.email)}
          helperText={touched.email && errors.email}
        />
        <TextField
          label="password"
          size="small"
          type={showPassword ? "text" : "password"}
          fullWidth
          name="password"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.password || ""}
          error={Boolean(touched.password && errors.password)}
          helperText={touched.password && errors.password}
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
        <Button
          variant="contained"
          sx={{ display: "block", mt: 2, mx: "auto" }}
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <ColorRing visible={true} height="30" width="30" colors={[""]} />
          ) : (
            "Login"
          )}
        </Button>
        <Typography variant="h6" component="p" sx={{ my: 2 }}>
          Don't have an account ? Then{"  "}
          <Link to="/signup" style={{ color: "deepskyblue" }}>
            Signup
          </Link>
        </Typography>
      </Box>
    </React.Fragment>
  );
};

export default Login;
