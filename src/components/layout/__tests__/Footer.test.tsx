import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "../Footer";
import { site } from "@/lib/site";

describe("Footer", () => {
  it("shows the brand logo (with site name as alt) and the tagline", () => {
    render(<Footer />);
    expect(screen.getByAltText(site.name)).toBeInTheDocument();
    expect(screen.getByText(site.tagline)).toBeInTheDocument();
  });

  it("links to the email with mailto and the phone with tel", () => {
    render(<Footer />);
    const email = screen.getByRole("link", { name: site.email });
    expect(email.getAttribute("href")).toBe(`mailto:${site.email}`);

    const phone = screen.getByRole("link", { name: site.phone });
    expect(phone.getAttribute("href")).toBe(
      `tel:${site.phone.replace(/\s/g, "")}`,
    );
  });

  it("shows the current year in the copyright line", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });
});
