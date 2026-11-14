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
- **Structure:** single cinematic scrolling story page + `/gallery` sub-page for all photos. On phones (< `md`) the same sections sit behind five tabs — see "Mobile" (2026-11-14).
- **Stack:** Astro + Tailwind, static, CDN-hosted.
- **Hosting + form:** Netlify + Netlify Forms (emails the host, built-in spam protection).
- **Pricing:** not shown — "rates on request."
- **Host presence:** named + one photo + short first-person note. Personal-reply promise is a feature.
- **Hero:** the beach→house drone clip, muted/looping, with a drone still as poster/fallback.
- **Visual direction:** Cool & coastal (see tokens above).
- **"Good to know" block:** removed in the 2026-11-14 revamp (Brian: "the BEFORE YOU ASK bullshit"). The 3 steps sit above the form; the stay rules are one sentence above it; "No pets" is in the essentials strip.

## Site map / section order (single page; revised 2026-11-14)

1. Hero: beach→cottage loop, one line, "Request your stay" + "See the photos"
2. The view: aerial, the beach on a clear day, the window (3 photos)
3. The essentials: sleeps 4 · 2 BR · 2 bath · full kitchen · wood stove · year-round (+ no pets)
4. The cottage: 4 interiors; "See all photos" → /gallery
5. Outside: deck, bay, outdoor shower (4 photos)
6. The area: Carters 5 min · Seascape Convenience 6 km · Liverpool 20 min · Halifax ~90 min · airport ~2 h; approximate map, no photos
7. Your host: Brian, note, "Send an inquiry"
8. Inquire: 3 steps + Netlify form; rules in one sentence; "rates on request"

Phones: 2–3 → Overview, 4–5 → Cottage, 6 → Area, 7 → Host, 8 → Inquire (navbar tabs).
Sub-page: `/gallery`: 20 photos in walkthrough order, one grid, no headings, no captions.

## Host & place (from Brian, 2026-06-18)

- **Host:** Brian Greening · inquiries → **briangreening@eastlink.ca** · photo provided later.
- **Domain:** **hitides.ca** (final target; may start on Netlify subdomain).
- **Sense of place (raw, to shape into copy):** built into a small, hidden Nova Scotia
  fishing village; tropical-like water and white-sand beaches; **5 minutes from Carters
  Beach**; **Seascape Convenience 6 km away on the way to Carters**; the town of
  **Liverpool a 20-minute drive** (all amenities); **Halifax about 90 minutes**, the
  **airport about 2 hours**. Brian loves the community; that warmth is the emotional core.
  (Corrected 2026-11-14: Liverpool was listed as 15 minutes before.)

## Media pipeline (my job; tools confirmed present: ffmpeg, sips)

- Interiors: `.CR3` (Canon RAW) → resized web JPEG → Astro `<Image>` → WebP/AVIF + lazy.
- Drone stills: `.DNG` (36 MP) → resized web JPEG → Astro `<Image>`.
- Hero/accent video: trim large `.MP4`/`.mov` to 10–20s muted loops, encode MP4 + WebM, poster frame.
- **Prereq:** `node`/`npm` not installed yet — needed before building Astro.
- **Need from host:** interior photos are now in `Content/images/` (good); still need a host photo.

## "Next level" motion & rails — locked decisions (2026-07-11)

Goal: tech in service of feel — more craft, no new features. Explicitly NOT
building: guest features (calendar, tours), host tooling, analytics.

- **Library over native-only:** everyone gets the same experience across
  browsers/mobile → GSAP + ScrollTrigger (scroll storytelling is its core
  competency). Per-component timelines; `gsap.matchMedia()` for
  reduced-motion and breakpoints.
- **ClientRouter** (`astro:transitions`) sitewide for the photo morph between
  The Home and /gallery in every browser. Discipline it imposes: every script
  (re)inits on `astro:page-load` and reverts on `astro:before-swap`
  (see `src/scripts/motion.ts`, Lightbox, InquiryForm; guarded by
  `tests/lifecycle.spec.ts`).
- **Photo morph identity:** `transition:name` derived from image alt text
  (`morphName()` in `src/data/gallery.ts`) — alt is already each image's
  identity (`featuredAltSet`).
- **Hero: scroll-scrub REJECTED (2026-07-13).** The spike (throwaway
  `spike/hero-scrub` branch, since deleted) was tested on a real phone:
  the ≤8 MB all-keyframe encode read as pixelated while scrubbing, and the
  scroll-to-fly interaction didn't feel good. Verdict: keep the original
  muted autoplaying beach-loop hero. No pinned/scrubbed sections anywhere on
  the site — the motion vocabulary below is the whole motion story. Don't
  re-propose scrubbing unless footage AND the size budget change materially.
- **Motion vocabulary (everything below the hero):** exactly three
  primitives — `data-reveal` (fade-and-rise, once), `data-stagger`
  (quick facts, how-it-works), `data-parallax` (four largest photos, ±5%
  drift, 1.12 overscale). No other pins or scrubs. One bespoke beat for The
  View is allowed later, only after living with the quiet version.
- **CI (Tier 2, hard failures):** GitHub Actions — build + Playwright
  (desktop + mobile projects, reduced-motion contract tests) + Lighthouse CI
  budgets: LCP ≤ 2.5s / CLS ≤ 0.1 (devtools throttling — Lantern simulation
  rejected: it reported ~3-4s LCP while observed LCP == FCP), script
  transfer ≤ 120 KB, committed video ≤ 8 MB.
- **No analytics, no monitoring:** Brian's inbox is the KPI. If a specific
  question ever demands it: Plausible for one month, read the answer,
  re-decide.

## Mobile: tabs + hero autoplay polish (2026-11-14)

Prompted by a real-phone review: the hero briefly showed a half-loaded frame
with a play glyph, and the story page is ~24 phone screens of scroll.

- **Hero loop on phones:** if playback is refused or fails (iOS Low Power
  Mode, "Auto-Play Video Previews" off, Data Saver, missing codec, failed
  fetch) the `<video>` is removed from layout and the still is the hero — no
  half-loaded frame with a play glyph, no player chrome (WebKit's start-
  playback button is also hidden by CSS). The first tap anywhere retries
  `play()`. For reduced-motion visitors autoplay is cancelled up front, so
  only the preload metadata is fetched (verified in WebKit). Guarded by
  tests/motion.spec.ts ("Hero loop fallback"). Autoplay refusal
  raises no event, so it is detected by a short grace timer after the first
  frame; the bare `autoplay` attribute is left to start playback.
- **Hero stays 100svh on phones — LCP depends on it (measured).** Chrome's
  LCP ignores an image/video covering the whole viewport (treated as
  background), which is why the hero text is the LCP element at 1.5 s. An
  88svh phone hero (so the tab bar would peek above the fold) made the video
  an LCP candidate at 5.3 s under Lighthouse throttling; every script variant
  failed the same way until the height went back. The in-hero wordmark is
  hidden below `sm` (the header already carries it — two anchors stacked on a
  phone read as a mistake).
- **Mobile tabs (< `md`):** the sections are grouped into five tabs behind a
  sticky bar directly under the hero — Overview (facts first, then The View)
  · Cottage (interiors first, then the stay, the shower) · Area · Host ·
  Inquire (form first, then good-to-know). Desktop is unchanged: TabPanel
  wrappers are `display: contents` from `md` up, the DOM order is still the
  desktop order, and `max-md:order-first` reorders within a panel on phones.
  Tabs write the URL fragment (`/#cottage`) with `replaceState`; same-page
  anchors (`#inquire` from the hero/header/host CTAs) open their panel before
  the normal jump. A tab switch dispatches `hitides:tabchange` so motion.ts
  refreshes ScrollTrigger. Files: src/data/tabs.ts, MobileTabs.astro,
  TabPanel.astro, src/scripts/tabs.ts; guarded by tests/tabs.spec.ts.
- **Hero video source — pick pending:** the loop is still the videographer's
  13 s export, which opens on the weakest frames of the shoot, is flat, and
  jump-cuts at the wrap. Four re-cuts from the raw 4K HLG masters (tone-
  mapped via VideoToolbox, 1 s crossfade loop) were rendered to the task
  artifacts; candidate A (master 0040 @ 50 s, beach and jetty) recommended.
  Once chosen: add the tone-map + crossfade steps to scripts/process-video.sh,
  regenerate MP4/WebM/poster under the 8 MB budget, refresh the hero still.

## Revamp: navbar, hero cut, copy, photos, area facts (2026-11-14)

Brian's review of the live site, point by point. All of it landed together.

- **Hero loop:** still the videographer's clip, from its first frame. "The
  drop" Brian meant is at the END: at ~10.8 s, close to the cottage, the
  gimbal pitches down. The window ends at 10.4 s and the last 1.5 s dissolve
  back into the opening, so the loop is 8.9 s. (First attempt cut the opening
  instead; wrong reading, corrected the same day.) scripts/process-video.sh
  takes `start|loop|xfade|MB` per clip and auto tone-maps HLG masters through
  VideoToolbox if one is ever used. ~5 MB MP4; the poster is the loop's first
  frame and is copied to src/assets/media for the hero still. The unused
  aerial loop and MediaShowcase are gone.
- **Hero:** one line and two buttons, centred vertically and horizontally.
  No wordmark (the navbar carries it) and no "Port Mouton, Nova Scotia"
  eyebrow. Still 100svh (LCP, see above).
- **Navbar with tabs** (Header.astro, src/scripts/tabs.ts, TabPanel.astro):
  fixed; transparent with the white wordmark over the hero, cool-white glass
  with the colour wordmark everywhere else, which also fixes the white
  logo on white on /gallery. Desktop: section links that scroll the story
  page with the current one underlined (scrollspy). Phones: a row of tabs
  that switch panels; past the hero only the 44px tab row stays. Both
  wordmark finishes are in the markup and CSS picks one.
- **Sections and photos:** 3 to 4 photos per section, the rest in the
  gallery. The view: aerial + beach on a clear day (Brian's photo) + the
  window; the cottage-and-coast frame and the yard view are out. "The stay"
  and "Outdoor shower" are one section, "Outside", with the deck/bay photos
  and two shower photos. The area has no photos. Every section ends in a
  "Request your stay" CTA; the footer adds Photos / Request your stay /
  Email Brian.
- **Copy:** rewritten short and plain. Struck at Brian's request: "It is not
  a resort...", "not down at sea level", and the cedar-posts/whimsy
  sentence. "Children welcome" removed everywhere (also CONTEXT.md). No em
  dashes anywhere in src, copy or comments.
- **The area, as Brian gave it:** Carters Beach 5-minute drive · Seascape
  Convenience 6 km on the way to Carters · Liverpool 20 minutes, all
  amenities · Halifax about 90 minutes · airport about 2 hours. Golf and
  restaurants dropped as separate items (Liverpool covers them).
- **Gallery:** 20 photos in walkthrough order (front door, living, kitchen,
  bedrooms and bath, deck, yard, outdoor shower, beach). One grid, no group
  headings, no captions (alt text only, also in the lightbox), a large tile
  every fifth photo alternating sides, Airbnb-style. Removed from the old
  32: #1, 2, 6, 8, 9, 11, 13, 15, 16, 18, 22, 23, 26, 28 (#12, the second
  bedroom, reinstated at Brian's request). Unused source JPEGs stay in
  src/assets/media; nothing unreferenced ships.
- **New photos from Brian:** originals in Content/images/beach/, web JPEGs at
  src/assets/media/beach-{sand,waves,moonrise,sunset}.jpg. Waves is in The
  view; sand and sunset close the gallery; moonrise is unused for now.
