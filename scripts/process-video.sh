#!/usr/bin/env bash
#
# process-video.sh — source video -> looping web hero derivatives
# ----------------------------------------------------------------
# Cuts a window out of a source clip and turns it into a muted, seamlessly
# looping background video plus a poster still:
#
#   <name>.mp4    H.264 / yuv420p, two-pass, sized to a per-clip MB budget
#   <name>.webm   VP9, same loop (smaller; modern browsers)
#   <name>.jpg    poster = the loop's first frame (public/media AND
#                 src/assets/media, where the hero <Picture> imports it)
#
# Seamless loop: the window is loopdur + xfade seconds long and the tail is
# crossfaded into the head (ffmpeg xfade), so the wrap point is a soft
# dissolve rather than a jump cut. Output length = loopdur.
#
# HLG sources (the raw DJI masters, transfer arib-std-b67) are tone-mapped to
# Rec.709 through VideoToolbox automatically; a naive conversion reads flat
# and grey. Rec.709 sources (the ProRes exports) pass straight through.
#
# Tools: ffmpeg + ffprobe (Homebrew). IDEMPOTENT: skips outputs newer than
# their source and this script.
#
# INPUT  (read-only, never modified, never committed): $CONTENT_DIR
# OUTPUT (committed):  $OUT_DIR (public/media) + $STILL_DIR (src/assets/media)
#
# Usage:
#   scripts/process-video.sh            # process the curated clip(s)
#   FORCE=1 scripts/process-video.sh    # rebuild even if up to date
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
  # Worktrees: fall back to the main checkout's sibling layout.
  if [ -d "$HOME/high-tides/Content" ]; then echo "$HOME/high-tides/Content"; return; fi
  echo "$REPO_ROOT/Content"
}

CONTENT_DIR="${CONTENT_DIR:-$(find_content_dir)}"
OUT_DIR="${OUT_DIR:-$REPO_ROOT/public/media}"
STILL_DIR="${STILL_DIR:-$REPO_ROOT/src/assets/media}"
MAX_W="${MAX_W:-1920}"   # 1080p: a 720p upscale reads pixelated on retina displays
FPS="${FPS:-30}"         # background loops do not need 60fps; spend the bits per frame
WEBM_CRF="${WEBM_CRF:-36}"
FORCE="${FORCE:-0}"

# Curated clip(s):  source (under Content/) | output | start (s) | loop length (s) | crossfade (s) | MB budget
#
# beach-loop: the videographer's 13 s beach->cottage export. The first 4.6 s
# are the drone dropping out of a wide shot (weak, flat frames), so the loop
# starts once it has settled above the water, flies in to the cottage, and
# dissolves back. 5 MB for 7.3 s is ~5.5 Mbps at 1080p30, well under CI's
# 8 MB per-file cap.
CLIPS=(
  "videos/drone/beach video.mov|beach-loop|4.6|7.3|1.0|5"
)

# --- helpers --------------------------------------------------------------
log() { printf '  %s\n' "$*"; }

up_to_date() { # $1 output  $2 source -> 0 if output is newer than source AND this script
  [ "$FORCE" = 1 ] && return 1
  [ -f "$1" ] && [ "$1" -nt "$2" ] && [ "$1" -nt "${BASH_SOURCE[0]}" ]
}

is_hlg() { # $1 source -> 0 if the first video stream is HLG (arib-std-b67)
  local trc
  trc="$(ffprobe -v error -select_streams v:0 -show_entries stream=color_transfer -of csv=p=0 "$1" 2>/dev/null || true)"
  [ "$trc" = "arib-std-b67" ]
}

process_clip() {
  local src="$1" name="$2" start="$3" loopdur="$4" xfade="$5" mb="$6"
  if [ ! -f "$src" ]; then
    log "SKIP (missing source): $src"
    return 0
  fi

  local mp4="$OUT_DIR/$name.mp4" webm="$OUT_DIR/$name.webm"
  local poster="$OUT_DIR/$name.jpg" still="$STILL_DIR/$name.jpg"
  mkdir -p "$OUT_DIR" "$STILL_DIR"

  if up_to_date "$mp4" "$src" && up_to_date "$webm" "$src" && up_to_date "$poster" "$src" && up_to_date "$still" "$src"; then
    log "ok (up to date): $name"
    return 0
  fi

  local total offset
  total="$(awk -v a="$loopdur" -v b="$xfade" 'BEGIN{printf "%.3f", a+b}')"
  offset="$(awk -v a="$loopdur" -v b="$xfade" 'BEGIN{printf "%.3f", a-b}')"

  local tmp; tmp="$(mktemp -d -t hitides-video)"
  local window="$tmp/window.mp4" looped="$tmp/looped.mp4"

  # 1) The window, as a near-lossless 1080p30 Rec.709 mezzanine.
  if is_hlg "$src"; then
    log "$name: HLG source, tone-mapping via VideoToolbox"
    ffmpeg -y -loglevel error -hwaccel videotoolbox -hwaccel_output_format videotoolbox_vld \
      -ss "$start" -t "$total" -i "$src" -an \
      -vf "scale_vt=w=$MAX_W:h=-2:color_matrix=bt709:color_primaries=bt709:color_transfer=bt709,hwdownload,format=p010le,format=yuv420p,fps=$FPS,eq=saturation=0.9" \
      -c:v libx264 -crf 10 -preset fast -pix_fmt yuv420p \
      -color_primaries bt709 -color_trc bt709 -colorspace bt709 "$window"
  else
    ffmpeg -y -loglevel error -ss "$start" -t "$total" -i "$src" -an \
      -vf "fps=$FPS,scale='min($MAX_W,iw)':-2,format=yuv420p" \
      -c:v libx264 -crf 10 -preset fast -pix_fmt yuv420p \
      -color_primaries bt709 -color_trc bt709 -colorspace bt709 "$window"
  fi

  # 2) Seamless loop: tail dissolves into head over $xfade seconds.
  local fc="[0:v]trim=start=${xfade}:end=${total},setpts=PTS-STARTPTS[a];[0:v]trim=start=0:end=${xfade},setpts=PTS-STARTPTS[b];[a][b]xfade=transition=fade:duration=${xfade}:offset=${offset},format=yuv420p[v]"
  ffmpeg -y -loglevel error -i "$window" -filter_complex "$fc" -map "[v]" -an \
    -c:v libx264 -crf 10 -preset fast -pix_fmt yuv420p "$looped"

  # 3) MP4: two-pass to the budget. CRF cannot promise a size; two-pass can.
  local kbps
  kbps=$(awk -v mb="$mb" -v s="$loopdur" 'BEGIN{printf "%d", mb*8192*0.98/s}')
  local passlog="$tmp/x264pass"
  ffmpeg -y -loglevel error -i "$looped" -an \
    -c:v libx264 -profile:v high -pix_fmt yuv420p -preset slow \
    -b:v "${kbps}k" -pass 1 -passlogfile "$passlog" -f null /dev/null
  ffmpeg -y -loglevel error -i "$looped" -an \
    -c:v libx264 -profile:v high -pix_fmt yuv420p -preset slow \
    -b:v "${kbps}k" -maxrate "$((kbps * 14 / 10))k" -bufsize "$((kbps * 2))k" \
    -pass 2 -passlogfile "$passlog" -movflags +faststart "$mp4"
  log "wrote: $name.mp4 ($(du -h "$mp4" | cut -f1), ${kbps} kbps, ${loopdur}s loop)"

  # 4) WebM: constrained quality, fed 90% of the budget (VP9 overshoots short clips).
  ffmpeg -y -loglevel error -i "$looped" -an \
    -c:v libvpx-vp9 -b:v "$((kbps * 9 / 10))k" -crf "$WEBM_CRF" -row-mt 1 "$webm"
  log "wrote: $name.webm ($(du -h "$webm" | cut -f1))"

  # 5) Poster = first frame of the loop, in both places it is needed.
  ffmpeg -y -loglevel error -i "$looped" -frames:v 1 -q:v 3 "$poster"
  cp "$poster" "$still"
  log "wrote: $name.jpg (poster + hero still)"

  rm -rf "$tmp"
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
echo "  output : $OUT_DIR  (+ poster copy in $STILL_DIR)"
echo "  format : max ${MAX_W}px @ ${FPS}fps, crossfade loop, two-pass MP4 + VP9 WebM"
echo

for entry in "${CLIPS[@]}"; do
  IFS='|' read -r rel name cstart cloop cxfade cmb <<<"$entry"
  process_clip "$CONTENT_DIR/$rel" "$name" "$cstart" "$cloop" "$cxfade" "$cmb"
done

echo
echo "Done."
