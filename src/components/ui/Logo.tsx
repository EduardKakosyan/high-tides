import Image from "next/image";
import { site } from "@/lib/site";

const LOGO_W = 1080;
const LOGO_H = 949;
const ASPECT = LOGO_W / LOGO_H;

interface LogoProps {
  /** Rendered height in pixels (default 40). Width auto-scales from aspect. */
  size?: number;
  /** Mark above-the-fold instances priority. */
  priority?: boolean;
  /** Optional wrapper className. */
  className?: string;
}

/**
 * High Tides logomark: yellow anchor crown forming the "Hi", navy "TIDES"
 * with the anchor body underneath. PNG asset at `public/logo.png`.
 * Replace with `logo.svg` later for sharper scaling — same dimensions
 * mean the `LOGO_W` / `LOGO_H` constants stay valid.
 */
export function Logo({ size = 40, priority = false, className }: LogoProps) {
  const width = Math.round(ASPECT * size);

  return (
    <span
      className={`inline-flex items-center ${className ?? ""}`.trim()}
      aria-hidden={false}
    >
      <Image
        src="/logo.png"
        alt={site.name}
        width={width}
        height={size}
        priority={priority}
        className="block h-auto w-auto select-none"
        style={{ height: `${size}px`, width: "auto" }}
      />
    </span>
  );
}
