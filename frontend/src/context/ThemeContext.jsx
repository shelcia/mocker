import React, { useState, createContext, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkTheme, setDarkTheme] = useState(false);

  const darkThemeLocal = localStorage.getItem("mockapi-theme");

  useEffect(() => {
    // console.log(JSON.stringify(darkThemeLocal), "true");
    if (darkThemeLocal === "true") {
      setDarkTheme(true);
    }
  }, []);

  return (
    <ThemeContext.Provider value={[darkTheme, setDarkTheme]}>
      {children}
    </ThemeContext.Provider>
  );
};
