#!/usr/bin/env bash
#
# process-media.sh — run the full media pipeline (images + video)
# ---------------------------------------------------------------
# Convenience wrapper that runs both sub-scripts in order. See each for detail:
#   scripts/process-images.sh   (.CR3/.DNG/.JPG -> web JPEG for Astro <Image>)
#   scripts/process-video.sh    (large .MP4/.mov -> muted MP4+WebM loop + poster)
#
# Reads RAW masters from Content/ (read-only) and writes committed derivatives
# to src/assets/media/ (images) and public/media/ (video). Idempotent.
#
# Usage:
#   scripts/process-media.sh          # curated sample set (default)
#   scripts/process-media.sh --all    # every still under Content/ + sample video
#
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

"$SCRIPT_DIR/process-images.sh" "$@"
echo
"$SCRIPT_DIR/process-video.sh"
