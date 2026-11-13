#!/usr/bin/env bash
# deploy-staging.sh — sync the develop branch to staging and restart the staging container.
#
# Steps (in order):
#   1. Fetch origin/develop without merging, so the current branch is never
#      touched (safe to run straight after deploy-prod.sh leaves master checked out).
#   2. Use `git archive` to extract wedding-website-production/ from origin/develop
#      into a temp dir, then rsync it into wedding-website-staging/, deleting any
#      files that no longer exist on develop.
#   3. Preserve data-staging/ — the bind-mounted SQLite database that holds RSVP
#      submissions. This directory is excluded from the rsync wipe so RSVP data
#      survives every redeploy.
#   4. Remove any stale staging-website container left over from a previous
#      compose project, then start the staging-website service from this project's
#      compose file.
#
# Can be run from any directory — the script locates the repo root automatically.
#
# Dependencies:
#   git             — network access to fetch origin/develop
#   rsync           — for the atomic wipe-and-sync of the staging directory
#   docker compose  — v2
#
# After a successful run the staging site is live at
# https://staging.soniainigo.pingu93.com.
#
# Note: this script lives in scripts/ rather than inside wedding-website-production/
# because that folder is what gets archived into staging — a script kept there
# would be copied into the staging site files and appear twice.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STAGING_DIR="$REPO_ROOT/wedding-website-staging"

cd "$REPO_ROOT"

# Fetch, never merge. `git pull origin develop` would merge develop into
# whatever branch is currently checked out (master, after deploy-prod.sh runs),
# silently polluting it.
git fetch origin develop

# Wipe-and-sync so files deleted or renamed on develop cannot linger in staging.
# data-staging/ is excluded because it is the bind-mounted staging SQLite
# database holding RSVPs -- it must survive redeploys.
mkdir -p "$STAGING_DIR"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
git archive origin/develop:wedding-website-production | tar -x -C "$tmp"
rsync -a --delete --exclude 'data-staging/' "$tmp/" "$STAGING_DIR/"

# staging-website was historically started from wedding-website-staging/, which
# makes it a container in a different compose project than this one. Both
# projects declare `container_name: staging-website`, so clear out any existing
# container of that name before bringing up this project's.
if [ -n "$(docker ps -aq -f 'name=^/staging-website$')" ]; then
  docker rm -f staging-website
fi

docker compose up -d --build staging-website
echo "Staging deployed to https://staging.soniainigo.pingu93.com"