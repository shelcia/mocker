import React, { useContext } from "react";
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { useRoutes } from "react-router-dom";
import routes from "./routes";
import { customTheme } from "./themes";
import { Toaster } from "react-hot-toast";
import { ThemeContext } from "./context/ThemeContext";
import { secondary }  from './themes/themeColors'
import "./styles/style.css";

const App = () => {
  const allPages = useRoutes(routes);

  const [darkTheme] = useContext(ThemeContext);
  
  const toasterOptions = {
    style: {
      fontWeight: 500,
      fontFamily: "'Poppins', sans-serif",
      background: darkTheme ? secondary[900] : secondary[100],
      color: darkTheme ? secondary[100] : secondary[900],
    },
  };
  
  const appTheme = customTheme({
    theme: darkTheme ? "dark" : "light",
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
};

export default App;
