import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RevealOnScroll } from "../RevealOnScroll";

describe("RevealOnScroll", () => {
  it("renders children", () => {
    render(
      <RevealOnScroll>
        <p>Hello water</p>
      </RevealOnScroll>,
    );
    expect(screen.getByText("Hello water")).toBeInTheDocument();
  });

  it("forwards className and id to the rendered element", () => {
    render(
      <RevealOnScroll className="custom-class" id="reveal-1">
        <span>content</span>
      </RevealOnScroll>,
    );
    const wrapper = screen.getByText("content").parentElement;
    expect(wrapper?.className).toContain("custom-class");
    expect(wrapper?.id).toBe("reveal-1");
  });

  it("supports the 'none' direction without throwing", () => {
    render(
      <RevealOnScroll direction="none">
        <span>still</span>
      </RevealOnScroll>,
    );
    expect(screen.getByText("still")).toBeInTheDocument();
  });
});
