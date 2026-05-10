import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionHeading } from "../SectionHeading";

describe("SectionHeading", () => {
  it("renders title and optional eyebrow and description", () => {
    render(
      <SectionHeading
        eyebrow="EYEBROW"
        title="The Title"
        description="A short description."
      />,
    );
    expect(screen.getByText("EYEBROW")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "The Title" }),
    ).toBeInTheDocument();
    expect(screen.getByText("A short description.")).toBeInTheDocument();
  });

  it("omits eyebrow and description when not provided", () => {
    render(<SectionHeading title="Minimal" />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Minimal" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("EYEBROW")).not.toBeInTheDocument();
  });

  it("applies the center alignment classes when requested", () => {
    render(<SectionHeading title="Centered" align="center" />);
    const heading = screen.getByRole("heading", { name: "Centered" });
    const wrapper = heading.parentElement;
    expect(wrapper?.className).toContain("items-center");
    expect(wrapper?.className).toContain("text-center");
  });
});
