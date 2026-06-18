#!/usr/bin/env bash
#
# process-images.sh — RAW stills -> web JPEG derivatives
# ------------------------------------------------------
# Turns Brian's raw camera/drone stills into web-ready JPEGs that Astro's
# <Image> component can then optimize (WebP/AVIF + responsive srcset) at build
# time.
#
#   .CR3 (Canon RAW interior stills)   -> downscaled web JPEG
#   .DNG (36 MP drone stills)          -> downscaled web JPEG
#   .JPG (already-baked stills)        -> downscaled web JPEG
#
# WHY JPEG and not WebP/AVIF here?  We hand a clean, reasonably-sized JPEG
# "source of truth" to Astro and let `astro:assets` emit the modern formats and
# the responsive variants. That keeps one tool (sips) responsible for the RAW
# decode and Astro responsible for delivery formats.
#
# Tools: `sips` (ships with macOS) decodes CR3/DNG and resizes. No extra deps.
#
# INPUT  (read-only, never modified, never committed): $CONTENT_DIR
# OUTPUT (committed):                                   $OUT_DIR
#
# The script is IDEMPOTENT: a derivative is only (re)written if it is missing or
# older than its source. Re-running is cheap and safe.
#
# Usage:
#   scripts/process-images.sh                 # process the curated SAMPLE set
#   scripts/process-images.sh --all           # process every still in Content/
#   MAX_DIM=3000 scripts/process-images.sh    # override long-edge cap
#
set -euo pipefail

# --- config ---------------------------------------------------------------
# Resolve repo root from this script's location so it works from any cwd and
# from inside a git worktree (Content/ lives at the real repo root).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Content/ is gitignored and may live at the *main* checkout rather than inside
# a worktree. Prefer a local Content/, else walk up to find one.
find_content_dir() {
  local d="$REPO_ROOT"
  if [ -d "$REPO_ROOT/Content" ]; then echo "$REPO_ROOT/Content"; return; fi
  while [ "$d" != "/" ]; do
    if [ -d "$d/Content" ]; then echo "$d/Content"; return; fi
    d="$(dirname "$d")"
  done
  echo "$REPO_ROOT/Content"  # fall back; the existence check below will error
}

CONTENT_DIR="${CONTENT_DIR:-$(find_content_dir)}"
OUT_DIR="${OUT_DIR:-$REPO_ROOT/src/assets/media}"
MAX_DIM="${MAX_DIM:-2400}"     # long-edge pixel cap for web derivatives
JPEG_QUALITY="${JPEG_QUALITY:-72}"

# Curated SAMPLE set: filename (under Content/) -> output basename.
# Keep this small — it is what the build renders by default. Add `--all` to
# process everything once Brian's full set is being published.
SAMPLE_STILLS=(
  "images/seating-area-indoor-1.CR3|seating-area-indoor"
  "images/kitchen-1.CR3|kitchen"
  "videos/drone/DJI_20250819115212_0026_D.DNG|aerial-bay"
)

# --- helpers --------------------------------------------------------------
log() { printf '  %s\n' "$*"; }

convert_one() {
  local src="$1" out="$2"
  if [ ! -f "$src" ]; then
    log "SKIP (missing source): $src"
    return 0
  fi
  # Idempotent: skip if output exists and is newer than source.
  if [ -f "$out" ] && [ "$out" -nt "$src" ]; then
    log "ok (up to date): $(basename "$out")"
    return 0
  fi
  mkdir -p "$(dirname "$out")"
  # -Z caps the LONG edge (preserves aspect ratio); re-encode as JPEG.
  sips -s format jpeg -s formatOptions "$JPEG_QUALITY" -Z "$MAX_DIM" \
    "$src" --out "$out" >/dev/null
  log "wrote: $(basename "$out") ($(du -h "$out" | cut -f1))"
}

# --- run ------------------------------------------------------------------
if [ ! -d "$CONTENT_DIR" ]; then
  echo "ERROR: Content dir not found: $CONTENT_DIR" >&2
  echo "       Set CONTENT_DIR=/path/to/Content and re-run." >&2
  exit 1
fi

echo "Image pipeline"
echo "  source : $CONTENT_DIR"
echo "  output : $OUT_DIR"
echo "  max dim: ${MAX_DIM}px   quality: ${JPEG_QUALITY}"
echo

if [ "${1:-}" = "--all" ]; then
  echo "Mode: ALL stills (.CR3/.DNG/.JPG) under Content/"
  # Mirror Content/'s structure flattened by extension stem into OUT_DIR.
  find "$CONTENT_DIR" \( -iname '*.CR3' -o -iname '*.DNG' -o -iname '*.JPG' \) -print0 \
    | while IFS= read -r -d '' src; do
        base="$(basename "$src")"
        stem="${base%.*}"
        # Lowercase + spaces->dashes for clean web filenames.
        clean="$(printf '%s' "$stem" | tr '[:upper:] ' '[:lower:]-')"
        convert_one "$src" "$OUT_DIR/$clean.jpg"
      done
else
  echo "Mode: SAMPLE set (pass --all to process everything)"
  for entry in "${SAMPLE_STILLS[@]}"; do
    rel="${entry%%|*}"
    name="${entry##*|}"
    convert_one "$CONTENT_DIR/$rel" "$OUT_DIR/$name.jpg"
  done
fi

echo
echo "Done. Derivatives in: $OUT_DIR"
