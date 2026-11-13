#!/usr/bin/env bash
# sync-new-subtitles.sh — re-time sidecar subtitles against the actual audio.
#
# Bazarr downloads subtitles that are often timed to a different release
# (a few seconds of extra intro/recap, or a different framerate), so they play
# early or late. This script finds subtitles that Bazarr (or anything else)
# dropped into the media library, measures the real offset with ffsubsync, and
# applies it in place, keeping the original as <file>.bak.
#
# Runs via cron: daily 03:30. Safe to re-run: files already processed (same
# path/size/mtime) are skipped, and files already in sync are left alone.
#
# Usage:
#   scripts/sync-new-subtitles.sh                  # process new/changed subtitles
#   scripts/sync-new-subtitles.sh --all            # re-check everything
#   scripts/sync-new-subtitles.sh --dry-run        # report only, change nothing
#   scripts/sync-new-subtitles.sh path/to/file.srt # just these files
set -euo pipefail

MEDIA_ROOT="${MEDIA_ROOT:-/mnt/mypassport/Media_Server/media}"
STATE_DIR="${XDG_STATE_HOME:-$HOME/.local/state}/subtitle-sync"
STATE_FILE="$STATE_DIR/processed.tsv"
LOCK_FILE="$STATE_DIR/sync.lock"
FFSUBSYNC_IMAGE="ghcr.io/smacke/ffsubsync:latest"

MIN_OFFSET="0.50"     # ignore corrections smaller than this (seconds)
MAX_FILES="20"        # per run, so a cron run cannot drag on forever
EXCLUDE_RE='(\.bak|\.orig|/torrents/|/data-staging/)'

DRY_RUN=0
PROCESS_ALL=0
declare -a TARGETS=()

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    --all)     PROCESS_ALL=1 ;;
    -h|--help) sed -n '2,20p' "$0"; exit 0 ;;
    -*) echo "Unknown option: $arg" >&2; exit 2 ;;
    *)  TARGETS+=("$arg") ;;
  esac
done

log() { printf '%s %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"; }

mkdir -p "$STATE_DIR"
exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  log "another subtitle-sync run is in progress, exiting"
  exit 0
fi

docker image inspect "$FFSUBSYNC_IMAGE" >/dev/null 2>&1 \
  || docker pull -q "$FFSUBSYNC_IMAGE" >/dev/null 2>&1 || true

# --- collect candidates -------------------------------------------------------
declare -a SUBS=()
if [[ ${#TARGETS[@]} -gt 0 ]]; then
  for t in "${TARGETS[@]}"; do
    [[ -f "$t" ]] && SUBS+=("$t")
  done
else
  while IFS= read -r -d '' f; do
    SUBS+=("$f")
  done < <(find "$MEDIA_ROOT" -type f \( -iname '*.srt' \) -print0 2>/dev/null \
             | grep -zvE "$EXCLUDE_RE" || true)
fi

# --- helpers -----------------------------------------------------------------
video_for() {
  # Strip the subtitle suffixes: "Movie.en.hi.srt" -> "Movie"
  local s="$1" base
  base="$(basename "$s")"
  base="${base%.*}"            # .srt
  base="${base%.*}"            # .en / .hi
  case "$base" in
    *.en|*.hi|*.eng|*.forced) base="${base%.*}" ;;
  esac
  local dir mkv
  dir="$(dirname "$s")"
  for ext in mkv mp4 avi m4v webm ts; do
    [[ -f "$dir/$base.$ext" ]] && { echo "$dir/$base.$ext"; return 0; }
  done
  # fall back: exactly one video file in the folder that starts with the base
  local hits=()
  while IFS= read -r -d '' v; do hits+=("$v"); done < <(
    find "$dir" -maxdepth 1 -type f \( -iname '*.mkv' -o -iname '*.mp4' -o -iname '*.avi' \) -print0 2>/dev/null
  )
  for v in "${hits[@]}"; do
    [[ "${v%.*}" == "$dir/$base" ]] && { echo "$v"; return 0; }
  done
  return 1
}

state_key() { stat -c '%n|%s|%Y' "$1"; }

already_done() {
  local key="$1"
  [[ -f "$STATE_FILE" ]] && grep -qxF "$key" "$STATE_FILE"
}

mark_done() {
  local key="$1"
  grep -qxF "$key" "$STATE_FILE" 2>/dev/null || echo "$key" >> "$STATE_FILE"
}

processed=0
changed=0

for srt in "${SUBS[@]}"; do
  (( processed >= MAX_FILES )) && { log "hit MAX_FILES=$MAX_FILES, will continue next run"; break; }

  # Only plain subtitle sidecars next to a video; skip embedded/named extras.
  [[ -s "$srt" ]] || continue
  [[ $(stat -c '%s' "$srt") -lt 500 ]] && continue

  video="$(video_for "$srt")" || { log "SKIP (no matching video): $srt"; continue; }
  key="$(state_key "$srt")"
  if [[ $PROCESS_ALL -eq 0 ]] && already_done "$key"; then continue; fi

  processed=$((processed + 1))
  tmp_out="$(mktemp -d)"

  log "checking: $srt"
  # Media root is always mounted; for explicit targets elsewhere, mount their dirs.
  declare -a mounts=(-v "$MEDIA_ROOT":"$MEDIA_ROOT":ro)
  for p in "$video" "$srt"; do
    d="$(dirname "$p")"
    case "$d/" in
      "$MEDIA_ROOT"/*) ;;
      *) [[ " ${mounts[*]} " == *" -v $d:$d:ro "* ]] || mounts+=(-v "$d":"$d":ro) ;;
    esac
  done
  sync_log="$(docker run --rm "${mounts[@]}" -v "$tmp_out":/out \
      --entrypoint ffs "$FFSUBSYNC_IMAGE" \
      "$video" -i "$srt" -o /out/synced.srt 2>&1 || true)"

  offset="$(grep -oE 'offset seconds: -?[0-9.]+' <<<"$sync_log" | grep -oE -- '-?[0-9.]+$' || echo 0)"
  scale="$(grep -oE 'framerate scale factor: [0-9.]+' <<<"$sync_log" | awk '{print $NF}' || echo 1)"
  score="$(grep -oE 'score: [0-9.]+' <<<"$sync_log" | awk '{print $NF}' || echo 0)"

  if [[ ! -s "$tmp_out/synced.srt" ]]; then
    log "  WARN: ffsubsync produced no output (score=$score), leaving file alone"
    rm -rf "$tmp_out"; continue
  fi

  need_change=0
  awk -v o="$offset" -v s="$scale" -v m="$MIN_OFFSET" \
      'BEGIN { exit !((o<0?-o:o) >= m || (s<1?-s:s) > 1.001) }' && need_change=1

  if [[ $need_change -eq 0 ]]; then
    log "  in sync (offset ${offset}s, scale ${scale}), nothing to do"
    [[ $DRY_RUN -eq 1 ]] || mark_done "$key"
    rm -rf "$tmp_out"; continue
  fi

  if [[ $DRY_RUN -eq 1 ]]; then
    log "  DRY RUN: would shift ${offset}s (scale ${scale}, score ${score})"
  else
    [[ -e "$srt.bak" ]] || cp -p "$srt" "$srt.bak"
    cp "$tmp_out/synced.srt" "$srt"
    chmod --reference="$srt.bak" "$srt" 2>/dev/null || true
    log "  shifted ${offset}s (scale ${scale}, score ${score}); backup: $(basename "$srt").bak"
    changed=$((changed + 1))
  fi
  [[ $DRY_RUN -eq 1 ]] || mark_done "$(state_key "$srt")"
  rm -rf "$tmp_out"
done

log "done: checked=$processed changed=$changed${DRY_RUN:+ }"
