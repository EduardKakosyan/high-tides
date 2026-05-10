# [ADR-0001] Frontend stack for the High Tides showcase site

- **Status**: Accepted
- **Date**: 2026-05-10
- **Decision-makers**: Eduard Kakosyan

## Context

High Tides is a single-property cottage showcase site — photos, videos, and a contact CTA. No payments, no auth, no booking engine. The site is the product: the design quality has to carry the experience, but the technical surface is small.

We were starting from the venture-template scaffold (pnpm + ESLint + Prettier + Vitest + Husky + Gitleaks + GitHub Actions). Next.js was not yet installed.

## Decision

Adopt the following stack:

| Concern       | Choice                                                                                         |
| ------------- | ---------------------------------------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router, React Server Components, Turbopack)                                    |
| Styling       | Tailwind CSS v4 (CSS-first `@theme` directive)                                                 |
| Media hosting | Cloudinary, integrated via `next-cloudinary` (`<CldImage>`, `<CldVideoPlayer>`)                |
| Smooth scroll | `lenis` via `lenis/react` — gated on `prefers-reduced-motion` and pointer-coarse media queries |
| UI animation  | `motion` (Framer Motion v12) for in-view reveals and nav state transitions                     |
| Photo gallery | `react-photo-album` (rows layout) + `yet-another-react-lightbox`                               |
| Fonts         | `next/font/google` — Fraunces (display serif) + Inter (sans)                                   |
| Contact       | `mailto:` and `tel:` anchors (no form backend)                                                 |
| Deploy target | Vercel                                                                                         |

A thin client-side re-export module (`src/lib/cld-client.ts`) wraps `next-cloudinary` to declare an explicit `"use client"` boundary — required because `next-cloudinary` v6 does not include the directive in its built output and its components call `useState` at render time.

## Consequences

### Positive

- All decisions are framework-defaults or well-known libraries; future contributors have no surprises.
- No backend: zero rate limiting, captcha, or queue infrastructure to maintain.
- Cloudinary delivers responsive images and adaptive video without us managing image pipelines or CDN configuration.
- Tailwind v4 keeps theme tokens in CSS where designers can read them, and removes the JS config file.

### Negative

- `next-cloudinary` requires the client-wrapper workaround; if the library ever adds a `"use client"` directive upstream, the wrapper can be removed.
- `mailto:` loses visitors with no configured mail client. Mitigated by showing the email and phone in plain text next to each button.
- The Cloudinary cloud name is required at build time; missing it triggers fallback UI rather than a failure, but real production deploys must set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.

### Neutral

- Lenis is disabled on touch and reduced-motion users — they get native scroll. This is the right default for accessibility but means the "premium" feel is desktop-first.

## Alternatives Considered

### Resend / Formspree contact form

Would let us track inquiries and add validation, but requires either a backend env var (Resend) or a third-party endpoint (Formspree). Out of scope per user direction.

### Local `/public` photos + raw `<video>` for the hero

Simpler, no third-party dependency, but ships large media to every visitor and tanks LCP without adaptive streaming. Cloudinary's `f_auto,q_auto,vc_auto` + HLS handles this for free.

### GSAP ScrollTrigger instead of Motion

GSAP gives finer scroll control (pin/scrub), but we don't need timeline choreography for this scope. Motion + Lenis covers the reveal and smooth-scroll story with a smaller footprint.

## References

- Plan: `~/.claude/plans/scalable-beaming-snail.md`
- [next-cloudinary docs](https://next-cloudinary.spacejelly.dev/)
- [Lenis](https://github.com/darkroomengineering/lenis)
- [Motion (Framer Motion v12)](https://motion.dev/)
- [react-photo-album](https://react-photo-album.com/)
- [yet-another-react-lightbox](https://yet-another-react-lightbox.com/)
