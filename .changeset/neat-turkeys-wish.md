---
"venture-template": minor
---

feat: build the High Tides cottage showcase site

- Bootstrap Next.js 16 + Tailwind v4 + TypeScript on top of the venture template scaffold.
- Add single-page landing composed of six sections: Hero (Cloudinary video), About, Gallery (masonry + lightbox), Amenities, Location, Contact.
- Wire Cloudinary via `next-cloudinary` with a client-boundary re-export (`src/lib/cld-client.ts`).
- Add Lenis smooth scroll (gated on reduced-motion + touch) and Framer Motion reveal-on-scroll.
- Add metadata, sitemap, and robots.
- Component tests across layout, sections, and ui primitives — coverage ~95% lines.
- ADR-0001 documents the stack choices.
