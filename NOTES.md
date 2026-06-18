# Design Notes — Hi Tides

## Prototype verdict (2026-06-18)

**Question the prototype answered:** Which palette + font direction feels like Hi Tides —
"Warm & airy" or "Cool & coastal"?

**Answer: Cool & coastal.** Crisp, airy, sea-air. Cedar-grey + Atlantic blue + cool white
lead; gold is the warm pop; purple is the held-back brand accent. Headlines in a clean
modern sans (Space Grotesk in the prototype), body in Inter.

Prototype lives at `prototype.html` (throwaway — delete once the real Astro site exists).

### Locked design tokens (Cool & coastal)

| Token        | Hex       | Role                                   |
|--------------|-----------|----------------------------------------|
| `--bg`       | `#F2F4F5` | cool white background                  |
| `--surface`  | `#E3E9EC` | pale grey-blue section background      |
| `--ink`      | `#16262F` | deep navy text / dark sections         |
| `--muted`    | `#586A74` | slate secondary text                   |
| `--line`     | `#D2DBDF` | hairlines / borders                    |
| `--blue`     | `#2B5EAB` | primary accent / CTA (Atlantic blue)   |
| `--gold`     | `#D9A12E` | warm pop (from the sign / mustard sofa)|
| `--purple`   | `#4A3B8C` | brand accent (held back; from the sign)|
| `--cedar`    | `#7E8A93` | grey-blue cedar tone                   |

- **Headline font:** clean modern sans — Space Grotesk in the prototype (revisit exact
  face during build; candidates: Space Grotesk, Archivo, or a refined grotesk).
- **Body font:** Inter.
- **Wordmark:** "Hi" in gold, "Tides" in navy/purple — echoes the painted sign. Open
  question: use a styled wordmark vs. the actual sign image as the logo.

### Still open / to confirm during build
- Exact headline typeface.
- Whether the real wordmark uses the physical sign image.
- Host first name, inquiry destination email, host's personal note (3-4 sentences).
- Interior photo culling/sequencing (RAW `.CR3` → web).
- Custom domain (e.g. hitides.ca?) vs Netlify subdomain.

## Locked decisions

- **Purpose:** vacation rental; visitors send an email Inquiry, host follows up personally. No payments/booking engine.
- **Structure:** single cinematic scrolling story page + `/gallery` sub-page for all photos.
- **Stack:** Astro + Tailwind, static, CDN-hosted.
- **Hosting + form:** Netlify + Netlify Forms (emails the host, built-in spam protection).
- **Pricing:** not shown — "rates on request."
- **Host presence:** named + one photo + short first-person note. Personal-reply promise is a feature.
- **Hero:** the beach→house drone clip, muted/looping, with a drone still as poster/fallback.
- **Visual direction:** Cool & coastal (see tokens above).
- **"Good to know" block:** yes — 3-step how-it-works + key facts (6-night min, no pets, year-round, sleeps 4).

## Site map / section order (single page)

1. Hero — beach→house video, wordmark, tagline, "Request your stay"
2. The View — the differentiator (cottage above the beach)
3. Quick facts row — sleeps 4 · 2 BR · 2 bath · wood stove · full kitchen · year-round
4. The Experience — atmosphere / lifestyle (deck, sunsets, slow mornings)
5. The Home — interiors, curated; "See all photos" → /gallery
6. The Area — Port Mouton & South Shore (Carters Beach, Keji Seaside, Liverpool, Lunenburg)
7. The Host — name, photo, personal note
8. Good to know / How it works — 3 steps + key facts
9. Inquire — Netlify form (name, email, dates, guests, message); "rates on request," approximate location/map only

Sub-page: `/gallery` — all photos grouped by room/area.

## Host & place (from Brian, 2026-06-18)

- **Host:** Brian Greening · inquiries → **briangreening@eastlink.ca** · photo provided later.
- **Domain:** **hitides.ca** (final target; may start on Netlify subdomain).
- **Sense of place (raw, to shape into copy):** built into a small, hidden Nova Scotia
  fishing village; tropical-like water and white-sand beaches; **5 minutes from Carters
  Beach**; the beautiful town of **Liverpool a 15-minute drive**; golf course and
  restaurants nearby. Brian loves the community — that warmth is the emotional core.

## Media pipeline (my job; tools confirmed present: ffmpeg, sips)

- Interiors: `.CR3` (Canon RAW) → resized web JPEG → Astro `<Image>` → WebP/AVIF + lazy.
- Drone stills: `.DNG` (36 MP) → resized web JPEG → Astro `<Image>`.
- Hero/accent video: trim large `.MP4`/`.mov` to 10–20s muted loops, encode MP4 + WebM, poster frame.
- **Prereq:** `node`/`npm` not installed yet — needed before building Astro.
- **Need from host:** interior photos are now in `Content/images/` (good); still need a host photo.
