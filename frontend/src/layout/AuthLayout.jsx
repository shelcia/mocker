import React from "react";
import {
  AppBar,
  Box,
  Card,
  CardContent,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import CustomToggle from "../components/CustomToggle";

const AuthLayout = ({ children }) => {
  return (
    <React.Fragment>
      <AppBar component="nav">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 800, textTransform: "uppercase" }}
          >
            Mocker
          </Typography>
          <Box>
            <CustomToggle />
          </Box>
        </Toolbar>
      </AppBar>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Card sx={{ minWidth: 275 }}>
          <CardContent>{children}</CardContent>
        </Card>
      </Container>
    </React.Fragment>
  );
};

export default AuthLayout;
