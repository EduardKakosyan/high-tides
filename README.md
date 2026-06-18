# Hi Tides

Story-driven marketing site for the **Hi Tides** cottage in Port Mouton, Nova
Scotia. Static Astro + Tailwind site, deployed to Netlify. Visitors send an
email inquiry; there is no payment or booking engine.

See `CONTEXT.md` (domain glossary) and `NOTES.md` (locked "Cool & coastal"
design system) for the full picture.

## Stack

- **Astro 5** — static output, minimal JS
- **Tailwind CSS 4** — design tokens in `src/styles/global.css` (`@theme`)
- **Self-hosted fonts** — Space Grotesk (headlines) + Inter (body) via `@fontsource`
- **Node 22** (pinned: `.nvmrc`, Dockerfile, `netlify.toml`)

## Develop

Pick whichever you like — both serve at <http://localhost:4321>.

### Local (fastest on macOS)

```bash
nvm use            # Node 22 (see .nvmrc)
npm install        # first time only
npm run dev        # live dev server
npm run build      # static output -> ./dist
npm run preview    # serve the built ./dist
```

### Containerized (pinned Node, no host install)

```bash
docker compose up dev              # live dev server at :4321
docker compose run --rm build      # static output -> ./dist
```

The container pins Node so scaffolding and the Netlify build behave the same
everywhere. `node_modules` lives in a named volume (Linux-native binaries are
never clobbered by the host bind mount), and `.dockerignore` keeps the multi-GB
raw media out of the build context.

> **Note (macOS):** Docker bind-mounts are slower and noisier on the
> filesystem than native dev. For day-to-day work the local flow above is
> recommended; the container is for build parity and reproducibility.

## Project layout

```
src/
  layouts/Base.astro        # html shell, head, fonts, header + footer
  components/
    Wordmark.astro          # "Hi" (gold) + "Tides" (purple) — from the painted sign
    Header.astro            # responsive header, wordmark + Inquire CTA
    Footer.astro            # wordmark + location line
  pages/index.astro         # home: placeholder hero (real hero -> #3) + intro
  styles/global.css         # Cool & coastal tokens + base styles
public/favicon.svg
```

## Raw media — keep it out of the repo and the scanner

`Content/` (8+ GB of RAW stills and drone video) and `.work/` (prototype thumbs)
are **gitignored**. They are also scoped out of Tailwind's class scanner via
`@import "tailwindcss" source("../")` in `global.css` — without that, Tailwind 4's
auto-detection walks the whole tree and tries to read gigabytes of video as
source text, pegging every CPU core. Keep new raw media under `Content/`.

## Deploy (Netlify)

Config lives in `netlify.toml` (`npm run build` → publish `dist/`, Node 22).

**Human-gated:** connect the repo to a Netlify site once to get a live
`*.netlify.app` URL; later point `hitides.ca` at it. The local build stands on
its own and needs no Netlify account.
