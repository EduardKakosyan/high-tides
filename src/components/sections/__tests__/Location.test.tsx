import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Location } from "../Location";
import { site } from "@/lib/site";

describe("Location", () => {
  it("renders the city, region and country from site config", () => {
    render(<Location />);
    expect(screen.getByText(new RegExp(site.address.city))).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(site.address.country)),
    ).toBeInTheDocument();
  });

  it("renders the section heading", () => {
    render(<Location />);
    expect(
      screen.getByRole("heading", { level: 2, name: /short drive/i }),
    ).toBeInTheDocument();
  });
});
