import React, { useContext } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext';

const CustomToggle = () => {
  const [darkTheme, setDarkTheme] = useContext(ThemeContext);

  return (
    <React.Fragment>
      <div className="flex items-center justify-center">
        {darkTheme ? (
          <FaMoon
            onClick={() => {
              setDarkTheme(!darkTheme);
              localStorage.setItem('mockapi-theme', 'false');
            }}
            size={'1.2rem'}
            style={{ cursor: 'pointer' }}
          />
        ) : (
          <FaSun
            onClick={() => {
              setDarkTheme(!darkTheme);
              localStorage.setItem('mockapi-theme', 'true');
            }}
            size={'1.2rem'}
            color="rgb(255,214,0)"
            style={{ cursor: 'pointer' }}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default CustomToggle;
