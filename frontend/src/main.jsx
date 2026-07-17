import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AOS from "aos";
import "aos/dist/aos.css";
import store from "./store";
import { getTheme } from "./themes";
import { ThemeModeProvider, useThemeMode } from "./context/ThemeModeContext";
import App from "./App";
import ErrorBoundary from "./components/common/ErrorBoundary";
import "./index.css";
import "./styles/tokens.css";

AOS.init({
  duration: 600,
  easing: "ease-out-cubic",
  once: true,
  offset: 40,
  disable: false,
});

function Root() {
  const { mode } = useThemeMode();
  return (
    <ThemeProvider theme={getTheme(mode)}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <App />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeModeProvider>
          <Root />
        </ThemeModeProvider>
      </BrowserRouter>
    </Provider>
  </ErrorBoundary>
);
