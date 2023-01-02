import React from "react";
import {
  AppBar,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import CustomToggle from "../components/CustomToggle";
import { MdStarRate } from "react-icons/md";

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
          <Box sx={{ display: "flex" }}>
            <Link
              href="https://mocker-docs.vercel.app/docs/intro"
              target="_blank"
              sx={{ mr: 2 }}
            >
              Docs
            </Link>
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
        <Grid container component="main">
          <Grid item xs={false} sm={4} md={7}>
            <Intro />
          </Grid>
          <Grid item xs={12} sm={8} md={5}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>{children}</CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default AuthLayout;

const Intro = () => {
  // const featureList = [
  //   {
  //     key: 1,
  //     name: "Unlimited Resources",
  //   },
  //   {
  //     key: 2,
  //     name: "Unlimited Projects",
  //   },
  //   {
  //     key: 3,
  //     name: "Readymade Endpoints",
  //   },
  //   {
  //     key: 4,
  //     name: "Schema Options",
  //   },
  // ];

  return (
    <>
      <Typography
        sx={{
          background: "linear-gradient(#1A77CD, #2499EF)",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        variant="h2"
        component="h1"
      >
        Mocker
      </Typography>
      <List dense={true}>
        <ListItem>
          <ListItemIcon>
            <MdStarRate />
          </ListItemIcon>
          <ListItemText primary="Unlimited Resources" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <MdStarRate />
          </ListItemIcon>
          <ListItemText primary="Unlimited Projects" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <MdStarRate />
          </ListItemIcon>
          <ListItemText primary="Readymade Endpoints" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <MdStarRate />
          </ListItemIcon>
          <ListItemText primary="Schema Options" />
        </ListItem>
      </List>
    </>
  );
};
