import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#175cdd",
      light: "#4a90e2",
      dark: "#0f4ba0",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#112344",
      light: "#2a3a5c",
      dark: "#0a1628",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f4f8ff",
      paper: "#ffffff",
    },
    text: {
      primary: "#112344",
      secondary: "#3c4049",
    },
    success: {
      main: "#059669",
      light: "#d1fae5",
    },
    warning: {
      main: "#d97706",
      light: "#fef3c7",
    },
    error: {
      main: "#dc2626",
      light: "#fee2e2",
    },
    info: {
      main: "#0284c7",
      light: "#e0f2fe",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 800,
      fontSize: "2.5rem",
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 700,
      fontSize: "1.5rem",
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
      fontSize: "1.1rem",
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: 1.4,
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: "1rem",
    },
    body1: {
      fontSize: "0.95rem",
      lineHeight: 1.7,
    },
    button: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
      textTransform: "none",
      letterSpacing: "0.01em",
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0 1px 3px rgba(0,0,0,0.04)",
    "0 2px 8px rgba(0,0,0,0.06)",
    "0 4px 16px rgba(0,0,0,0.08)",
    "0 6px 24px rgba(0,0,0,0.10)",
    "0 8px 32px rgba(0,0,0,0.12)",
    "0 12px 40px rgba(0,0,0,0.14)",
    "0 16px 48px rgba(0,0,0,0.16)",
    "0 20px 56px rgba(0,0,0,0.18)",
    ...Array(16).fill("0 20px 56px rgba(0,0,0,0.18)"),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 10,
          padding: "10px 24px",
          fontSize: "0.95rem",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(23, 92, 221, 0.3)",
            transform: "translateY(-1px)",
          },
          transition: "all 0.2s ease",
        },
        contained: {
          background: "linear-gradient(135deg, #175cdd 0%, #4a90e2 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #0f4ba0 0%, #175cdd 100%)",
          },
        },
        outlined: {
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.04)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 30px rgba(0,0,0,0.10)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
          fontFamily: '"Montserrat", sans-serif',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            "&.Mui-focused fieldset": {
              borderColor: "#175cdd",
              borderWidth: 2,
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#175cdd",
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            fontWeight: 700,
            fontFamily: '"Montserrat", sans-serif',
            fontSize: "0.85rem",
            color: "#112344",
            backgroundColor: "#f8fafc",
            borderBottom: "2px solid #e2e8f0",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #f1f5f9",
          padding: "14px 16px",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontFamily: '"Montserrat", sans-serif',
          fontWeight: 700,
        },
      },
    },
  },
});

export default theme;
