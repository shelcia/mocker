import React, { useContext } from "react";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  Divider,
  Card,
  Stack,
  Button,
} from "@mui/material";
import { HiMenuAlt3 } from "react-icons/hi";
import { FaSun, FaMoon } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const DashboardLayout = ({ children }, props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [darkTheme, setDarkTheme] = useContext(ThemeContext);

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
      <Typography
        variant="h6"
        sx={{ my: 2, fontWeight: 800, textTransform: "uppercase" }}
      >
        Mocker
      </Typography>
      <Divider />
      {darkTheme ? (
        <FaMoon
          onClick={() => {
            setDarkTheme(!darkTheme);
            localStorage.setItem("mockapi-theme", darkTheme);
          }}
          size={"1.2rem"}
          style={{ cursor: "pointer" }}
        />
      ) : (
        <FaSun
          onClick={() => {
            setDarkTheme(!darkTheme);
            localStorage.setItem("mockapi-theme", darkTheme);
          }}
          size={"1.2rem"}
          color="rgb(255,214,0)"
          style={{ cursor: "pointer" }}
        />
      )}
      <Button sx={{ ml: 2 }} onClick={logout}>
        Logout
      </Button>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box>
      <AppBar component="nav">
        <Toolbar>
          <Typography
            variant="h6"
            // component="div"
            sx={{ flexGrow: 1, fontWeight: 800, textTransform: "uppercase" }}
          >
            Mocker
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
          <Box sx={{ display: { sx: "none" } }}>
            <Stack
              direction="row"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {darkTheme ? (
                <FaMoon
                  onClick={() => {
                    setDarkTheme(!darkTheme);
                    localStorage.setItem("mockapi-theme", false);
                  }}
                  size={"1.2rem"}
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <FaSun
                  onClick={() => {
                    setDarkTheme(!darkTheme);
                    localStorage.setItem("mockapi-theme", true);
                  }}
                  size={"1.2rem"}
                  color="rgb(255,214,0)"
                  style={{ cursor: "pointer" }}
                />
              )}
              <Button sx={{ ml: 2 }} onClick={logout}>
                Logout
              </Button>
            </Stack>
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
          <Card sx={{ m: 4, p: 4 }}>{children}</Card>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
