import React, { useState } from "react";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  Divider,
  Card,
  Button,
  useMediaQuery,
  Stack,
} from "@mui/material";
import { HiMenuAlt3 } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import CustomToggle from "../components/CustomToggle";
// import Grad1 from "../assets/home/gradient-1.svg";
// import Grad2 from "../assets/home/gradient-2.svg";
import Logo from "../assets/images/logo.png";

const drawerWidth = 240;

const DashboardLayout = ({ children }, props) => {
  const mobileMatches = useMediaQuery("(max-width:425px)");

  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigate = useNavigate("");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Stack direction="row" sx={{ justifyContent: "center", my: 2 }}>
        <Typography
          variant="h6"
          sx={{ mr: 1, fontWeight: 900, textTransform: "uppercase" }}
        >
          Mocker
        </Typography>
        <CustomToggle />
      </Stack>

      <Divider />
      <Button variant="contained" onClick={logout} sx={{ mt: 4 }}>
        Logout
      </Button>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box>
      {/* <img src={Grad1} alt="" style={{ position: "fixed", zIndex: -1 }} />
      <img
        src={Grad2}
        alt=""
        style={{ position: "fixed", top: 0, zIndex: -1 }}
      /> */}
      <AppBar component="nav">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 900, textTransform: "uppercase" }}
          >
            <img src={Logo} alt="logo" width={16} height={16} /> Mocker
          </Typography>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <HiMenuAlt3 />
          </IconButton>
          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
            <CustomToggle />
            <Button sx={{ ml: 2 }} onClick={logout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" className="w-100">
        <Toolbar />
        <Box className="row w-100" sx={{ px: 2, pt: 2 }}>
          <Card sx={{ m: mobileMatches ? 1 : 4, p: mobileMatches ? 1 : 4 }}>
            {children}
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
