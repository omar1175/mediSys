import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { ThemeProvider } from "@mui/material/styles";
import authReducer from "../store/slices/authSlice";
import doctorsReducer from "../store/slices/doctorsSlice";
import appointmentsReducer from "../store/slices/appointmentsSlice";
import medicalHistoryReducer from "../store/slices/medicalHistorySlice";
import paymentsReducer from "../store/slices/paymentsSlice";
import chatsReducer from "../store/slices/chatSlice";
import { ThemeModeProvider } from "../context/ThemeModeContext";
import { getTheme } from "../themes";

export function makeStore(preloadedState) {
  return configureStore({
    reducer: {
      auth: authReducer,
      doctors: doctorsReducer,
      appointments: appointmentsReducer,
      medicalHistory: medicalHistoryReducer,
      payments: paymentsReducer,
      chats: chatsReducer,
    },
    preloadedState,
  });
}

// Renders a component tree with the same providers used in main.jsx so tests
// exercise the real runtime wiring (router, redux, theme mode, MUI theme).
export function renderWithProviders(
  ui,
  { route = "/", preloadedState, store = makeStore(preloadedState) } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <ThemeModeProvider>
            <ThemeProvider theme={getTheme("light")}>{children}</ThemeProvider>
          </ThemeModeProvider>
        </MemoryRouter>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper }) };
}
