import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    paper2: string;
    ink: string;
    clay: Palette["primary"];
  }
  interface PaletteOptions {
    paper2?: string;
    ink?: string;
  }
}

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#FCFAF6",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#28241E",
      secondary: "#6B6358",
    },
    primary: {
      main: "#B07A5B",
      dark: "#8A5E44",
      contrastText: "#FCFAF6",
    },
    secondary: {
      main: "#28241E",
      contrastText: "#FCFAF6",
    },
    divider: "#E8E0D3",
    success: { main: "#3F6B3B" },
    warning: { main: "#B07A5B" },
    error: { main: "#9A4040" },
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
      styleOverrides: {
        root: { borderRadius: 2, paddingInline: 20, paddingBlock: 10 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FCFAF6",
          color: "#28241E",
          boxShadow: "none",
          borderBottom: "1px solid #E8E0D3",
        },
      },
    },
  },
});

export default theme;
