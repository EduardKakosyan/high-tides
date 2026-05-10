import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Location } from "../Location";
import { site } from "@/lib/site";

describe("Location", () => {
  it("renders the city, region and country from site config", () => {
    render(<Location />);
    // The city appears in the heading and the address block, so use getAllByText.
    expect(
      screen.getAllByText(new RegExp(site.address.city)).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByText(new RegExp(site.address.country)),
    ).toBeInTheDocument();
  });

  it("renders the section heading", () => {
    render(<Location />);
    expect(
      screen.getByRole("heading", { level: 2, name: /lighthouse route/i }),
    ).toBeInTheDocument();
  });

  it("shows the 4-minute walk to the private beach in the distance list", () => {
    render(<Location />);
    expect(screen.getByText(/private beach/i)).toBeInTheDocument();
    expect(screen.getByText(/4-minute walk/i)).toBeInTheDocument();
  });
});
