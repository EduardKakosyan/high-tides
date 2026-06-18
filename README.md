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
    MediaShowcase.astro     # optimized <Image> stills + processed video loop (#6)
  pages/index.astro         # home: placeholder hero (real hero -> #3) + intro + media demo
  styles/global.css         # Cool & coastal tokens + base styles
  assets/media/             # committed web JPEG stills (Astro <Image> optimizes these)
public/
  media/                    # committed web video (MP4 + WebM) + poster frames
  favicon.svg
scripts/
  process-media.sh          # runs both pipelines below
  process-images.sh         # .CR3/.DNG/.JPG -> web JPEG
  process-video.sh          # large .MP4/.mov -> muted MP4+WebM loop + poster
```

## Raw media — keep it out of the repo and the scanner

`Content/` (8+ GB of RAW stills and drone video) and `.work/` (prototype thumbs)
are **gitignored**. They are also scoped out of Tailwind's class scanner via
`@import "tailwindcss" source("../")` in `global.css` — without that, Tailwind 4's
auto-detection walks the whole tree and tries to read gigabytes of video as
source text, pegging every CPU core. Keep new raw media under `Content/`.

## Media pipeline — RAW masters → web-ready assets

Brian's masters in `Content/` are huge (Canon `.CR3`, 36 MP drone `.DNG`,
multi-GB `.MP4`/`.mov`). They are **never committed and never modified**. A pair
of idempotent scripts turn them into small, committed web derivatives:

| Source (`Content/`)         | Tool     | Output (committed)        | Consumed by                       |
| --------------------------- | -------- | ------------------------- | --------------------------------- |
| `.CR3` / `.DNG` / `.JPG`    | `sips`   | `src/assets/media/*.jpg`  | Astro `<Image>` (AVIF/WebP+srcset) |
| large `.MP4` / `.mov`       | `ffmpeg` | `public/media/*.{mp4,webm,jpg}` | `<video>` (muted loop + poster) |

**Convention:** stills go to `src/assets/media/` so `astro:assets` `<Image>`
can emit AVIF/WebP + a responsive `srcset` and lazy-load them at build time.
Videos go to `public/media/` (Astro's `<Image>` does not process video) and are
referenced by absolute URL (`/media/<name>.mp4`).

### Prerequisites

- macOS `sips` (built in) — decodes/resizes RAW stills.
- `ffmpeg` + `ffprobe` (`brew install ffmpeg`) — trims/encodes video.

### Run it

```bash
npm run media          # process the curated SAMPLE set (fast; what the site renders)
npm run media:all      # process EVERY still under Content/ (+ the sample video)
npm run media:images   # stills only
npm run media:video    # video only
# or call the scripts directly:
scripts/process-media.sh
```

The scripts auto-locate `Content/` (it lives at the main checkout root, so they
walk up from the repo root and also work from inside a git worktree). Override
anything via env vars:

```bash
MAX_DIM=3000 JPEG_QUALITY=80 scripts/process-images.sh   # bigger / higher-quality stills
START=00:00:05 DUR=15 MAX_W=1600 scripts/process-video.sh # different trim window
```

**Idempotent:** a derivative is only (re)written if it is missing or older than
its source, so re-running is cheap. To add/curate sample assets, edit the
`SAMPLE_STILLS` / `SAMPLE_CLIPS` arrays near the top of each script.

The default sample set is one interior seating area + one kitchen (`.CR3`), one
aerial bay still (`.DNG`), and a ~7s muted drone loop from
`Content/videos/drone/main-aeral.mp4` (MP4 + WebM + poster).

## Deploy (Netlify)

Config lives in `netlify.toml` (`npm run build` → publish `dist/`, Node 22).

**Human-gated:** connect the repo to a Netlify site once to get a live
`*.netlify.app` URL; later point `hitides.ca` at it. The local build stands on
its own and needs no Netlify account.
