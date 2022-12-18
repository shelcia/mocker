import React, { useEffect, useState } from "react";
import { Chip, Container, Paper } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { apiProvider } from "../../services/utilities/provider";

const EmailVerify = () => {
  const [searchParam] = useSearchParams();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("200");

  const auth_token = searchParam.get("auth");
  const ref = searchParam.get("ref");

  useEffect(() => {
    apiProvider.getSingle("auth/auth_token", auth_token).then((result) => {
      setMessage(result.message);
      setStatus(result.status);
      if (result.status === "200") {
        setTimeout(() => {
          location.href = ref;
        }, 2000);
      }
    });
  }, []);

  return (
    <Container>
      <Paper elevation={4}>
        <Chip
          sx={{ width: "100%" }}
          label={message}
          color={status === "200" ? "success" : "error"}
        />
      </Paper>
    </Container>
  );
};

export default EmailVerify;
