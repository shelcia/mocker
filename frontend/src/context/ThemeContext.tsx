import React, {
  createContext,
  useEffect,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react';

export type ThemeContextValue = [boolean, Dispatch<SetStateAction<boolean>>];

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [darkTheme, setDarkTheme] = useState<boolean>(false);

  useEffect(() => {
    const darkThemeLocal = localStorage.getItem('mockapi-theme');
    if (darkThemeLocal === 'true') {
      setDarkTheme(true);
    }
  }, []);

  return (
    <ThemeContext.Provider value={[darkTheme, setDarkTheme]}>{children}</ThemeContext.Provider>
  );
};
