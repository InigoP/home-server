#!/usr/bin/env bash
# Deploy the `develop` branch of the wedding website to the staging container.
#
# This script lives in scripts/ rather than inside wedding-website-production/
# on purpose: wedding-website-staging/ is regenerated from the production
# folder by this script, so any deploy script kept there gets copied along
# with it and shows up twice.
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