import React from "react";
import { AppBar, Button, Toolbar } from "@mui/material";

const Topbar = () => {
  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          Mock
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography> */}
          <Button color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default Topbar;
