#!/usr/bin/env bash
# deploy-prod.sh — merge develop into main and redeploy the production container.
#
# Steps (in order):
#   1. Fetch the latest commits from origin.
#   2. Check out main and fast-forward merge origin/develop into it.
#   3. Push main to origin.
#   4. Rebuild and restart the wedding-website Docker container in place
#      (docker compose up -d --build).
#
# Can be run from any directory — the script locates the repo root automatically
# using the path of the script itself (BASH_SOURCE[0]).
#
# Dependencies:
#   git             — must be authenticated and able to push to origin
#   docker compose  — v2 (the `docker compose` subcommand, not docker-compose)
#
# After a successful run the site is live at https://soniainigo.pingu93.com.
#
# Note: this script lives in scripts/ rather than inside wedding-website-production/
# because deploy-staging.sh archives that folder into staging — a deploy script
# kept there would be copied into the staging site files and appear twice.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$REPO_ROOT"

git fetch origin
git checkout main
git merge origin/develop --no-edit
git push origin main

docker compose up -d --build wedding-website
echo "Production deployed to https://soniainigo.pingu93.com"

# Seed guest list from guests.sql into both production and staging databases.
GUESTS_SQL="$REPO_ROOT/wedding-website-production/data/guests.sql"
PROD_DB="$REPO_ROOT/wedding-website-production/data/wedding.db"
STAGING_DB="$REPO_ROOT/wedding-website-staging/data-staging/wedding.db"
if [ -f "$GUESTS_SQL" ]; then
  sqlite3 "$PROD_DB" < "$GUESTS_SQL"
  echo "Guest list seeded into production from guests.sql."
  if [ -f "$STAGING_DB" ]; then
    sqlite3 "$STAGING_DB" < "$GUESTS_SQL"
    echo "Guest list seeded into staging from guests.sql."
  fi
fi