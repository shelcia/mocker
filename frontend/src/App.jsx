import React, { useState } from "react";
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { useRoutes } from "react-router-dom";
import routes from "./routes";
import { customTheme } from "./themes";
import { Toaster } from "react-hot-toast";

function App() {
  const allPages = useRoutes(routes);

  const toasterOptions = {
    style: {
      fontWeight: 500,
      fontFamily: "'Poppins', sans-serif",
    },
  };

  const appTheme = customTheme({
    theme: "light",
    direction: "ltr",
  });

  return (
    <React.Fragment>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={appTheme}>
          <CssBaseline />
          <Toaster toastOptions={toasterOptions} />
          {allPages}
        </ThemeProvider>
      </StyledEngineProvider>
    </React.Fragment>
  );
}

export default App;
