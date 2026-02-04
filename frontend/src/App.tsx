import React from 'react';

import { Toaster } from 'react-hot-toast';
import { useRoutes } from 'react-router-dom';

import routes from './routes';

import './styles/style.css';

const App = () => {
  const allPages = useRoutes(routes);

  const toasterOptions = {
    style: {
      fontWeight: 500,
      fontFamily: "'DM Sans Variable', sans-serif",
    },
  };

  return (
    <div className="min-h-screen bg-background font-['DM Sans Variable'] text-foreground">
      <Toaster toastOptions={toasterOptions} />
      {allPages}
    </div>
  );
};

export default App;
