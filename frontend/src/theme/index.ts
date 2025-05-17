import { createContext } from "react";

import { DEFAULT_APP_THEME } from "../const/app";

export type ThemeContextType = {
  appTheme: "light" | "dark";
  toggleAppTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  appTheme: DEFAULT_APP_THEME,
  toggleAppTheme() {},
});

ThemeContext.displayName = "ThemeContext";
