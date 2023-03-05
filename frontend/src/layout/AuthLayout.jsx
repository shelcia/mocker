import React from "react";
import {
  AppBar,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
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
import { FiGithub } from "react-icons/fi";
import Grad1 from "../assets/home/gradient-1.svg";
import Grad2 from "../assets/home/gradient-2.svg";

const AuthLayout = ({ children }) => {
  return (
    <React.Fragment>
      <img src={Grad1} alt="" style={{ position: "fixed", zIndex: -1 }} />
      <img
        src={Grad2}
        alt=""
        style={{ position: "fixed", top: 0, zIndex: -1 }}
      />
      <AppBar component="nav">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 800, textTransform: "uppercase" }}
          >
            Mocker
          </Typography>
          <Link href="https://github.com/shelcia/mocker" target="_blank">
            <IconButton color="primary" style={{ cursor: "pointer" }}>
              <FiGithub size={"1rem"} />
            </IconButton>
          </Link>
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
          height: "90vh",
        }}
      >
        <Grid container component="main">
          <Grid item xs={false} sm={4} md={7}>
            <Intro />
          </Grid>
          <Grid item xs={12} sm={8} md={5}>
            <Card sx={{ minWidth: 275, border: 0, boxShadow: 0 }}>
              <CardContent>{children}</CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Grid
        container
        component="footer"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "10vh",
        }}
      >
        Developed by
        <Link href="https://shelcia-dev.me/" target="_blank" ml={1}>
          Shelcia
        </Link>
      </Grid>
    </React.Fragment>
  );
};

export default AuthLayout;

const Intro = () => {
  const featureList = [
    {
      key: 1,
      name: "Unlimited Resources",
    },
    {
      key: 2,
      name: "Unlimited Projects",
    },
    {
      key: 3,
      name: "Readymade Endpoints",
    },
    {
      key: 4,
      name: "Customise Schema Options",
    },
  ];

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

      <Typography variant="h6" component="p">
        Mocker can generate mock data with API endpoints, powered by{"  "}
        <Link href="https://fakerjs.dev/" target="_blank">
          faker.js
        </Link>
      </Typography>
      <List dense={true}>
        {featureList.map((feature) => (
          <ListItem key={feature.key}>
            <ListItemIcon>
              <MdStarRate />
            </ListItemIcon>
            <ListItemText primary={feature.name} />
          </ListItem>
        ))}
      </List>
    </>
  );
};
