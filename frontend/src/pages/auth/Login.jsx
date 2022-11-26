import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { apiAuth } from "../../services/models/authModel";
import { toast } from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const loginUser = () => {
    const body = {
      email: email,
      password: password,
    };

    apiAuth.post(body, "signin").then((res) => {
      if (res.status === "200") {
        navigate(`/${res.message.userId}`);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <React.Fragment>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Login
      </Typography>
      <TextField
        label="email"
        size="small"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
        fullWidth
      />
      <TextField
        label="password"
        size="small"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        fullWidth
      />
      <Button
        variant="contained"
        sx={{ display: "block", mt: 2, mx: "auto" }}
        onClick={loginUser}
      >
        Login
      </Button>
      <Typography variant="h6" component="p" sx={{ my: 2 }}>
        Don't have an account Then{"  "}
        <Link to="/signup" style={{ color: "deepskyblue" }}>
          Signup
        </Link>
      </Typography>
    </React.Fragment>
  );
};

export default Login;
