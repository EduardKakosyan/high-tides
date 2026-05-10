import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// jsdom doesn't ship IntersectionObserver; framer-motion's whileInView needs it.
class MockIntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn().mockReturnValue([]);
}

vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

// jsdom's matchMedia is a no-op; provide a deterministic stub so components
// that read prefers-reduced-motion / pointer queries don't crash.
if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
}
