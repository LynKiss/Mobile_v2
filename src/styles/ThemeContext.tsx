// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { theme as lightTheme } from "../styles/theme";

type ThemeType = typeof lightTheme;

interface ThemeContextProps {
  theme: ThemeType;
  toggleTheme?: () => void;
  mode?: "light" | "dark";
}

const darkTheme: ThemeType = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: "#0A84FF",
    background: "#000000",
    surface: "#1C1C1E",
    text: "#FFFFFF",
    textSecondary: "#8E8E93",
    border: "#3A3A3C",
  },
};

const ThemeContext = createContext<ThemeContextProps>({ theme: lightTheme });

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const currentTheme = mode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme, mode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
