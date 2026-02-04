import React, { useContext } from 'react';

import { Moon, Sun } from 'lucide-react';

import { ThemeContext } from '../../context/ThemeContext';
import { Button } from '../ui/button';

const CustomToggle = () => {
  const [darkTheme, setDarkTheme] = useContext(ThemeContext);

  return (
    <Button
      variant="ghost"
      className="p-0 h-6 w-6 cursor-pointer"
      onClick={() => {
        setDarkTheme(!darkTheme);
        localStorage.setItem('mockapi-theme', !darkTheme ? 'true' : 'false');
      }}
    >
      {darkTheme ? <Moon size="1.2rem" /> : <Sun size="1.2rem" color="rgb(255,214,0)" />}
    </Button>
  );
};

export default CustomToggle;
