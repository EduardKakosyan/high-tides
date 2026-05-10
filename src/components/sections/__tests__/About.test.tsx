import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { About } from "../About";

describe("About", () => {
  it("renders the section heading", () => {
    render(<About />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /quiet stretch of coast/i,
      }),
    ).toBeInTheDocument();
  });

  it("describes the property in the body copy", () => {
    render(<About />);
    expect(screen.getByText(/loved this place for years/i)).toBeInTheDocument();
  });
});
