import React, { useEffect, useState } from "react";
import { Container, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { apiAuth } from "../../services/models/authModel";
import { CustomTypoDisplay } from "../../components/CustomDisplay";

const EmailVerify = () => {
  const { id } = useParams();

  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("200");

  const navigate = useNavigate();

  useEffect(() => {
    apiAuth.put({}, `verification/${id}`).then((res) => {
      //   console.log(res);
      if (res.status === "200") {
        setMessage("Verified Sucessfully");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        setStatus(res.status);
        setMessage("Verification Failed");
      }
    });
  }, []);

  return (
    <Container>
      <Paper elevation={4}>
        <CustomTypoDisplay status={status === "200"}>
          {message}
        </CustomTypoDisplay>
      </Paper>
    </Container>
  );
};

export default EmailVerify;
