"use client";

import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider, CssBaseline, useMediaQuery } from "@mui/material";
import { buildTheme } from "./theme";

type ColorMode = "light" | "dark" | "system";

interface ColorModeCtx {
  mode: ColorMode;
  setMode: (m: ColorMode) => void;
  resolved: "light" | "dark";
}

export const ColorModeContext = React.createContext<ColorModeCtx>({
  mode: "system",
  setMode: () => {},
  resolved: "light",
});

export function useColorMode() {
  return React.useContext(ColorModeContext);
}

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)", { noSsr: true });

  const [mode, setModeState] = React.useState<ColorMode>(() => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem("cr-color-mode") as ColorMode) ?? "system";
  });

  const setMode = React.useCallback((m: ColorMode) => {
    setModeState(m);
    localStorage.setItem("cr-color-mode", m);
  }, []);

  const resolved: "light" | "dark" =
    mode === "system" ? (prefersDark ? "dark" : "light") : mode;

  const theme = React.useMemo(() => buildTheme(resolved), [resolved]);

  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ColorModeContext.Provider value={{ mode, setMode, resolved }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AppRouterCacheProvider>
  );
}
