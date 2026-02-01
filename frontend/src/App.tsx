import React, { useContext } from 'react';
import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import routes from './routes';
import { customTheme } from './themes';
import { Toaster } from 'react-hot-toast';
import { ThemeContext } from './context/ThemeContext';
import './styles/style.css';

const App = () => {
  const allPages = useRoutes(routes);

  const toasterOptions = {
    style: {
      fontWeight: 500,
      fontFamily: "'DM Sans Variable', sans-serif",
    },
  };

  const [darkTheme] = useContext(ThemeContext);

  const appTheme = customTheme({
    theme: darkTheme ? 'dark' : 'light',
    direction: 'ltr',
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
