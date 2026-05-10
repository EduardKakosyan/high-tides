import { site } from "@/lib/site";

type LogoProps = React.HTMLAttributes<HTMLSpanElement>;

/**
 * Wordmark for High Tides.
 *
 * The proper logo isn't ready yet, so this renders a serif wordmark for now.
 * When the logo file lands, drop it in at `public/logo.svg` (and a dark
 * variant if needed) and swap the inner content for a `next/image` `<Image>`
 * — the existing `className` / data-attribute pass-through means Nav's
 * scroll-state colour transition keeps working without changes at the call
 * site.
 */
export function Logo({ className, ...rest }: LogoProps) {
  return (
    <span
      {...rest}
      className={`font-display text-xl tracking-tight ${className ?? ""}`.trim()}
    >
      {site.name}
    </span>
  );
}
