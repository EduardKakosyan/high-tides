import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { About } from "../About";

describe("About", () => {
  it("renders the section heading", () => {
    render(<About />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /small cottage in a smaller village/i,
      }),
    ).toBeInTheDocument();
  });

  it("describes Port Mouton character in the body copy", () => {
    render(<About />);
    expect(screen.getByText(/been coming here for years/i)).toBeInTheDocument();
  });
});
