import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { apiAuth } from "../../services/models/authModel";
import { toast } from "react-hot-toast";
import { blue } from "@mui/material/colors";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const loginUser = () => {
    if (
      !String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      toast.error("Please enter valid email");
    }

    const body = {
      email: email,
      password: password,
    };

    apiAuth.post(body, "register").then((res) => {
      if (res.status === "200") {
        navigate(`/`);
        toast.success("Registration successful");
      }
    });

    // axios.post(`${BACKEND_URL}auth/signin`, body).then((res) => {
    //   if (res.data.status === "200") {
    //     navigate(`/${res.data.message.userId}`);
    //   }
    // });
  };

  return (
    <React.Fragment>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Signup
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
        Signup
      </Button>
      <Typography variant="h6" component="p" sx={{ mb: 2 }}>
        Have an account already ? Then
        <Link to="/" sx={{ color: blue[500] }}>
          Login
        </Link>
      </Typography>
    </React.Fragment>
  );
};

export default Signup;
