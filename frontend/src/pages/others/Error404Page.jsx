import React from "react";
import { Box, Button, Typography, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Img from "../../assets/404.png";

const Error404Page = () => {
  const navigate = useNavigate();
  return (
    <React.Fragment>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            p: 5,
          }}
        >
          <img src={Img} alt="404 error information" height={300} />
          <Typography variant="h1" sx={{ mt: 2 }}>
            404
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            The page you’re looking for doesn’t exist.
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={() => navigate("/")}
          >
            Go Home
          </Button>
        </Box>
      </CardContent>
    </React.Fragment>
  );
};

export default Error404Page;
