import { createTheme, type PaletteMode } from "@mui/material/styles";

export function buildTheme(mode: PaletteMode) {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      background: {
        default: isDark ? "#1A1714" : "#FCFAF6",
        paper:   isDark ? "#242018" : "#FFFFFF",
      },
      text: {
        primary:   isDark ? "#EDE8DF" : "#28241E",
        secondary: isDark ? "#A89E90" : "#6B6358",
      },
      primary: {
        main:         "#B07A5B",
        dark:         "#8A5E44",
        contrastText: "#FCFAF6",
      },
      secondary: {
        main:         isDark ? "#EDE8DF" : "#28241E",
        contrastText: isDark ? "#1A1714" : "#FCFAF6",
      },
      divider: isDark ? "#2E2A24" : "#E8E0D3",
      success: { main: "#3F6B3B" },
      warning: { main: "#B07A5B" },
      error:   { main: "#9A4040" },
    },
    shape: { borderRadius: 3 },
    typography: {
      fontFamily: "var(--font-worksans), sans-serif",
      h1: { fontFamily: "var(--font-cormorant), serif", fontWeight: 600 },
      h2: { fontFamily: "var(--font-cormorant), serif", fontWeight: 600 },
      h3: { fontFamily: "var(--font-cormorant), serif", fontWeight: 600 },
      h4: { fontFamily: "var(--font-cormorant), serif", fontWeight: 600 },
      h5: { fontFamily: "var(--font-cormorant), serif", fontWeight: 600 },
      h6: { fontFamily: "var(--font-cormorant), serif", fontWeight: 600 },
      overline: {
        fontFamily: "var(--font-plexmono), monospace",
        letterSpacing: "0.13em",
      },
      button: { textTransform: "none", letterSpacing: "0.03em" },
    },
    components: {
      MuiButton: {
        styleOverrides: { root: { borderRadius: 2, paddingInline: 20, paddingBlock: 10 } },
      },
      MuiPaper: {
        styleOverrides: { root: { backgroundImage: "none" } },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? "#1F1C17" : "#FCFAF6",
            color:           isDark ? "#EDE8DF" : "#28241E",
            boxShadow:       "none",
            borderBottom:    `1px solid ${isDark ? "#2E2A24" : "#E8E0D3"}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: { borderColor: isDark ? "#2E2A24" : "#E8E0D3" },
        },
      },
    },
  });
}

// Compat export giữ các import cũ không bị lỗi
import { createTheme as _ct } from "@mui/material/styles";
const theme = buildTheme("light");
export default theme;
