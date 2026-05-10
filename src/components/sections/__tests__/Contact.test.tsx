import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Contact } from "../Contact";
import { site } from "@/lib/site";

describe("Contact", () => {
  it("renders an Email us button with a mailto link including the subject", () => {
    render(<Contact />);
    const email = screen.getByRole("link", { name: /email us/i });
    const href = email.getAttribute("href") ?? "";
    expect(href.startsWith("mailto:")).toBe(true);
    expect(href).toContain(site.email);
    expect(href).toContain(encodeURIComponent(site.inquirySubject));
  });

  it("renders a Call us button with a tel link stripped of spaces", () => {
    render(<Contact />);
    const call = screen.getByRole("link", { name: /call us/i });
    expect(call.getAttribute("href")).toBe(
      `tel:${site.phone.replace(/\s/g, "")}`,
    );
  });

  it("also lists the email and phone in plain text for accessibility", () => {
    render(<Contact />);
    // both the button label and the plain-text duplicate exist, so we expect ≥1
    expect(screen.getAllByText(site.email).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(site.phone).length).toBeGreaterThanOrEqual(1);
  });
});
