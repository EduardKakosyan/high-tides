import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScrollIndicator } from "../ScrollIndicator";

describe("ScrollIndicator", () => {
  it("renders the default label", () => {
    render(<ScrollIndicator />);
    expect(screen.getByText("Scroll")).toBeInTheDocument();
  });

  it("accepts a custom label", () => {
    render(<ScrollIndicator label="Discover" />);
    expect(screen.getByText("Discover")).toBeInTheDocument();
  });
});
