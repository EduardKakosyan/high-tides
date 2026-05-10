"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState } from "react";

interface SmoothScrollProps {
  children: React.ReactNode;
}

/**
 * Wraps the app in Lenis smooth scroll, but only on pointer-fine devices
 * with no reduced-motion preference. Mobile / reduced-motion users get
 * native scroll for battery and accessibility reasons.
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");

    const update = () => {
      setEnabled(!reducedMotion.matches && !coarsePointer.matches);
    };

    update();
    reducedMotion.addEventListener("change", update);
    coarsePointer.addEventListener("change", update);

    return () => {
      reducedMotion.removeEventListener("change", update);
      coarsePointer.removeEventListener("change", update);
    };
  }, []);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
