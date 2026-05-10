import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Nav } from "../Nav";
import { site } from "@/lib/site";

function setScrollY(y: number) {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true });
  window.dispatchEvent(new Event("scroll"));
}

describe("Nav", () => {
  it("starts in the transparent (not-scrolled) state", () => {
    setScrollY(0);
    render(<Nav />);
    const header = screen.getByRole("banner");
    expect(header.getAttribute("data-scrolled")).toBe("false");
  });

  it("flips to the scrolled state past the threshold", () => {
    setScrollY(0);
    render(<Nav />);
    const header = screen.getByRole("banner");

    act(() => {
      setScrollY(200);
    });

    expect(header.getAttribute("data-scrolled")).toBe("true");

    act(() => {
      setScrollY(10);
    });

    expect(header.getAttribute("data-scrolled")).toBe("false");
  });

  it("renders an Enquire link pointing to the configured email", () => {
    render(<Nav />);
    const enquire = screen.getByRole("link", { name: /enquire/i });
    expect(enquire.getAttribute("href")).toContain(`mailto:${site.email}`);
    expect(enquire.getAttribute("href")).toContain(
      encodeURIComponent(site.inquirySubject),
    );
  });

  it("renders nav links for each on-page section", () => {
    render(<Nav />);
    for (const label of [
      "The place",
      "Gallery",
      "Amenities",
      "Location",
      "Contact",
    ]) {
      const link = screen.getByRole("link", { name: label });
      expect(link.getAttribute("href")?.startsWith("#")).toBe(true);
    }
  });
});
