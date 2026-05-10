# High Tides

A single-property showcase site for the High Tides cottage. Built with Next.js 16 (App Router) + Tailwind v4 + Cloudinary.

The site is editorial-first: hero video, About, photo gallery with lightbox, amenities, location, and a `mailto:` contact CTA. No booking engine, no auth, no payments — just a beautiful storefront for the property.

## Quick start

```bash
pnpm install
cp .env.example .env.local       # add your Cloudinary cloud name
pnpm dev                          # http://localhost:3000
```

If you don't yet have a Cloudinary cloud name, the site renders fallback gradients and placeholder images so you can iterate on layout without uploading assets.

## Wiring up your media

1. Create a Cloudinary account (free) and copy your **cloud name** into `.env.local`:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   ```
2. Upload your photos and the hero video to folders under `high-tides/` in your Cloudinary dashboard.
3. Open [`src/lib/media.ts`](./src/lib/media.ts) and replace the placeholder `publicId`s with your real ones. Set accurate `width`, `height`, and `alt` for every photo.
4. Edit [`src/lib/site.ts`](./src/lib/site.ts) to set the property name, tagline, email, phone, address, and amenities.

That's the whole content surface — no CMS, no rebuild scripts. Re-run `pnpm dev` (or deploy) after editing.

## Commands

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `pnpm dev`           | Run the Next.js dev server     |
| `pnpm build`         | Build for production           |
| `pnpm start`         | Serve the production build     |
| `pnpm lint`          | ESLint + Prettier check        |
| `pnpm lint:fix`      | Auto-fix lint issues           |
| `pnpm type-check`    | `tsc --noEmit`                 |
| `pnpm test`          | Run all unit tests             |
| `pnpm test:coverage` | Tests + coverage report (≥60%) |
| `pnpm secrets:scan`  | Gitleaks scan of the codebase  |
| `pnpm changeset`     | Create a version changeset     |

## Project structure

```
src/
  app/
    layout.tsx              # fonts, metadata, SmoothScroll wrapper
    page.tsx                # composes the six sections
    globals.css             # Tailwind v4 import + @theme tokens
    sitemap.ts / robots.ts
  components/
    layout/    Nav, Footer, SmoothScroll (Lenis)
    sections/  Hero, About, Gallery, Amenities, Location, Contact
    ui/        SectionHeading, RevealOnScroll, ScrollIndicator
  lib/
    site.ts        # property content (name, address, amenities, email, phone)
    media.ts       # Cloudinary public_id registry
    cloudinary.ts  # cloud-name + hasCloudinary feature flag
    cld-client.ts  # client boundary re-export for next-cloudinary
```

## Deploying

1. Push to GitHub.
2. Import the repository in Vercel.
3. Set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` in the Vercel project's environment variables.
4. Deploy. Preview URLs work the same way per-branch.

## Architecture decisions

See [`docs/adr/0001-stack-choice.md`](./docs/adr/0001-stack-choice.md) for the rationale behind the stack choices (Next.js 16, Tailwind v4, Cloudinary, Lenis, Motion, gallery libs, `mailto:` contact).

## Git workflow

`main` is the long-lived branch. Cut feature branches off `main` and merge back via PR. Commit format is `type: description` (`feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `ci`, `perf`) — enforced by commitlint.

```bash
git checkout -b feat/something
# make changes
pnpm lint && pnpm type-check && pnpm test
git commit -m "feat: something"
```

Pre-commit runs Gitleaks + lint-staged. Pre-push optionally runs the GitHub Actions workflow locally via [act](https://github.com/nektos/act).

## Accessibility & performance notes

- Smooth scroll is disabled when `prefers-reduced-motion: reduce` is set **or** when the user is on a coarse pointer (touch device).
- All scroll-triggered reveals (`RevealOnScroll`) short-circuit to a static render under reduced-motion.
- Every `CldImage` has alt text sourced from `lib/media.ts`.
- The hero serves a poster image as the LCP element; the video loads after.
- Fonts use `next/font` with `display: 'swap'` to avoid blank text on first paint.
