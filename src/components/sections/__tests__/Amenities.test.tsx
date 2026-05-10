import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Amenities } from "../Amenities";
import { site } from "@/lib/site";

describe("Amenities", () => {
  it("renders one heading per amenity group", () => {
    render(<Amenities />);
    for (const group of site.amenities) {
      expect(
        screen.getByRole("heading", { name: group.title, level: 3 }),
      ).toBeInTheDocument();
    }
  });

  it("renders every amenity item", () => {
    render(<Amenities />);
    const total = site.amenities.reduce((n, g) => n + g.items.length, 0);
    const items = screen.getAllByRole("listitem");
    expect(items.length).toBe(total);
  });
});
