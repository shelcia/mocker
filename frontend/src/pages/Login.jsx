import React from "react";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const loginUser = () => {
    const body = {
      email: email,
      password: password,
    };

    axios.post(`${BACKEND_URL}auth/signin`, body).then((res) => {
      if (res.data.status === "200") {
        navigate(`/${res.data.message.userId}`);
      }
    });
  };

  return (
    <React.Fragment>
      <Card sx={{ width: 400, mx: "auto", mt: 10 }}>
        <CardContent sx={{ textAlign: "center" }}>
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
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default Login;
