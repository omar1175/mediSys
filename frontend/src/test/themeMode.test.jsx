import { describe, it, expect } from "vitest";
import { render, act, renderHook } from "@testing-library/react";
import {
  ThemeModeProvider,
  useThemeMode,
  getMode,
} from "../context/ThemeModeContext";
import {
  useTemplateColors,
  templateColors,
  lightTemplateColors,
  darkTemplateColors,
} from "../styles/templateTheme";

function wrapper({ children }) {
  return <ThemeModeProvider>{children}</ThemeModeProvider>;
}

describe("ThemeModeContext", () => {
  it("defaults to light and reflects on <html data-theme>", () => {
    render(<div />, { wrapper });
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(getMode()).toBe("light");
  });

  it("toggles between light and dark", () => {
    const { result } = renderHook(() => useThemeMode(), { wrapper });
    expect(result.current.mode).toBe("light");

    act(() => result.current.toggleTheme());
    expect(result.current.mode).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(getMode()).toBe("dark");

    act(() => result.current.toggleTheme());
    expect(result.current.mode).toBe("light");
  });

  it("persists the chosen mode to localStorage", () => {
    const { result } = renderHook(() => useThemeMode(), { wrapper });
    act(() => result.current.setMode("dark"));
    expect(window.localStorage.getItem("medisys-theme-mode")).toBe("dark");
  });

  it("restores a stored preference on mount", () => {
    window.localStorage.setItem("medisys-theme-mode", "dark");
    const { result } = renderHook(() => useThemeMode(), { wrapper });
    expect(result.current.mode).toBe("dark");
  });
});

describe("useTemplateColors", () => {
  it("returns the light palette by default", () => {
    const { result } = renderHook(() => useTemplateColors(), { wrapper });
    expect(result.current).toBe(lightTemplateColors);
  });

  it("switches palette when the mode toggles (shared provider)", () => {
    function useBoth() {
      return { ...useThemeMode(), colors: useTemplateColors() };
    }
    const { result } = renderHook(() => useBoth(), { wrapper });

    expect(result.current.colors).toBe(lightTemplateColors);
    act(() => result.current.toggleTheme());
    expect(result.current.colors).toBe(darkTemplateColors);
  });
});

describe("templateColors proxy", () => {
  it("resolves values based on the active module-level mode", () => {
    // getMode() drives the proxy; render a provider and toggle to dark.
    const { result } = renderHook(() => useThemeMode(), { wrapper });
    act(() => result.current.setMode("dark"));
    expect(templateColors.accent).toBe(darkTemplateColors.accent);
    act(() => result.current.setMode("light"));
    expect(templateColors.accent).toBe(lightTemplateColors.accent);
  });
});
