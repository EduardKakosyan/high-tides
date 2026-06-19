#!/usr/bin/env bash
#
# process-video.sh — large source video -> web loop derivatives
# -------------------------------------------------------------
# Trims large .MP4/.mov source clips (some multi-GB) into short, muted,
# web-ready loops for use as background/accent <video> elements, plus a poster
# still for the first paint / no-JS fallback.
#
# For each source clip we emit:
#   <name>.mp4    — H.264 / yuv420p, muted, ~10-20s, capped resolution (broad support)
#   <name>.webm   — VP9, muted, same trim (smaller; modern browsers)
#   <name>.jpg    — poster frame grabbed near the start of the trim
#
# Videos are NOT run through Astro's <Image>; they live in public/media/ and are
# referenced by absolute URL (/media/<name>.mp4) from a <video> element.
#
# Tools: `ffmpeg` + `ffprobe` (Homebrew). IDEMPOTENT — skips outputs newer than
# their source.
#
# INPUT  (read-only, never modified, never committed): $CONTENT_DIR
# OUTPUT (committed):                                   $OUT_DIR (public/media)
#
# Usage:
#   scripts/process-video.sh                 # process the curated SAMPLE clip(s)
#   START=00:00:05 DUR=12 scripts/process-video.sh   # override trim window
#
set -euo pipefail

# --- config ---------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

find_content_dir() {
  local d="$REPO_ROOT"
  if [ -d "$REPO_ROOT/Content" ]; then echo "$REPO_ROOT/Content"; return; fi
  while [ "$d" != "/" ]; do
    if [ -d "$d/Content" ]; then echo "$d/Content"; return; fi
    d="$(dirname "$d")"
  done
  echo "$REPO_ROOT/Content"
}

CONTENT_DIR="${CONTENT_DIR:-$(find_content_dir)}"
OUT_DIR="${OUT_DIR:-$REPO_ROOT/public/media}"
START="${START:-00:00:00}"   # trim start (HH:MM:SS)
DUR="${DUR:-12}"             # trim duration in seconds (~10-20s loop)
MAX_W="${MAX_W:-1280}"       # cap width; height auto (keeps file small)
CRF="${CRF:-30}"            # H.264 quality knob (higher = smaller). 28-32 is sane for loops.
WEBM_CRF="${WEBM_CRF:-36}"  # VP9 quality knob; VP9 needs a higher CRF than x264 for similar size.

# Curated SAMPLE clip(s): source (under Content/) | output name | start | dur
# main-aeral.mp4 is a clean ~7s beach->house drone pass — perfect for a loop.
SAMPLE_CLIPS=(
  "videos/drone/main-aeral.mp4|aerial-loop|00:00:00|7"
  "videos/drone/beach video.mov|beach-loop|00:00:00|13"
)

# --- helpers --------------------------------------------------------------
log() { printf '  %s\n' "$*"; }

newer_than_src() { # $1 output  $2 source -> 0 if up to date
  [ -f "$1" ] && [ "$1" -nt "$2" ]
}

process_clip() {
  local src="$1" name="$2" start="$3" dur="$4"
  if [ ! -f "$src" ]; then
    log "SKIP (missing source): $src"
    return 0
  fi

  local mp4="$OUT_DIR/$name.mp4"
  local webm="$OUT_DIR/$name.webm"
  local poster="$OUT_DIR/$name.jpg"
  mkdir -p "$OUT_DIR"

  # Scale filter: cap width to MAX_W, keep aspect, force even dims (codec req).
  local vf="scale='min($MAX_W,iw)':-2"

  # --- MP4 (H.264) ---
  if newer_than_src "$mp4" "$src"; then
    log "ok (up to date): $name.mp4"
  else
    ffmpeg -y -loglevel error -ss "$start" -t "$dur" -i "$src" \
      -an -vf "$vf" \
      -c:v libx264 -profile:v high -pix_fmt yuv420p -crf "$CRF" -preset slow \
      -movflags +faststart \
      "$mp4"
    log "wrote: $name.mp4 ($(du -h "$mp4" | cut -f1))"
  fi

  # --- WebM (VP9) ---
  if newer_than_src "$webm" "$src"; then
    log "ok (up to date): $name.webm"
  else
    ffmpeg -y -loglevel error -ss "$start" -t "$dur" -i "$src" \
      -an -vf "$vf" \
      -c:v libvpx-vp9 -b:v 0 -crf "$WEBM_CRF" -row-mt 1 \
      "$webm"
    log "wrote: $name.webm ($(du -h "$webm" | cut -f1))"
  fi

  # --- Poster frame (grab 1s into the trim, or at start if clip is short) ---
  if newer_than_src "$poster" "$src"; then
    log "ok (up to date): $name.jpg"
  else
    ffmpeg -y -loglevel error -ss "$start" -i "$src" \
      -frames:v 1 -vf "$vf" -q:v 3 \
      "$poster"
    log "wrote: $name.jpg ($(du -h "$poster" | cut -f1))"
  fi
}

# --- run ------------------------------------------------------------------
if [ ! -d "$CONTENT_DIR" ]; then
  echo "ERROR: Content dir not found: $CONTENT_DIR" >&2
  echo "       Set CONTENT_DIR=/path/to/Content and re-run." >&2
  exit 1
fi

command -v ffmpeg >/dev/null || { echo "ERROR: ffmpeg not found on PATH" >&2; exit 1; }

echo "Video pipeline"
echo "  source : $CONTENT_DIR"
echo "  output : $OUT_DIR"
echo "  trim   : start=$START dur=${DUR}s   max width=${MAX_W}px   crf=$CRF"
echo

for entry in "${SAMPLE_CLIPS[@]}"; do
  IFS='|' read -r rel name cstart cdur <<<"$entry"
  process_clip "$CONTENT_DIR/$rel" "$name" "${cstart:-$START}" "${cdur:-$DUR}"
done

echo
echo "Done. Web video in: $OUT_DIR"
