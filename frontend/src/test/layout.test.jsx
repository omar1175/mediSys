import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "./testUtils";
import TemplateNavbar from "../components/Layout/TemplateNavbar";
import PageTitle from "../components/common/PageTitle";

describe("TemplateNavbar (public site smoke)", () => {
  it("renders without throwing and shows nav + theme toggle", () => {
    renderWithProviders(<TemplateNavbar />);
    // Brand appears (there are multiple "Clinic" nodes: drawer + navbar)
    expect(screen.getAllByText("Clinic").length).toBeGreaterThan(0);
    // The theme toggle button is present and labelled for a11y
    expect(
      screen.getByRole("button", { name: /toggle dark mode/i })
    ).toBeInTheDocument();
  });

  it("toggling the theme button flips <html data-theme>", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TemplateNavbar />);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");

    await user.click(
      screen.getByRole("button", { name: /toggle dark mode/i })
    );
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
});

describe("PageTitle (breadcrumb theming)", () => {
  it("renders title, subtitle and breadcrumbs without throwing", () => {
    renderWithProviders(
      <PageTitle
        title="Our Doctors"
        subtitle="Meet the team"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Doctors" },
        ]}
      />
    );
    expect(screen.getByText("Our Doctors")).toBeInTheDocument();
    expect(screen.getByText("Meet the team")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Doctors")).toBeInTheDocument();
  });

  it("renders fine with no breadcrumbs", () => {
    renderWithProviders(<PageTitle title="About Us" />);
    expect(screen.getByText("About Us")).toBeInTheDocument();
  });
});
