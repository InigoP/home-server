#!/usr/bin/env bash
# deploy-prod.sh — merge develop into master and redeploy the production container.
#
# Steps (in order):
#   1. Fetch the latest commits from origin.
#   2. Check out master and fast-forward merge origin/develop into it.
#   3. Push master to origin.
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
git checkout master
git merge origin/develop --no-edit
git push origin master

docker compose up -d --build wedding-website
echo "Production deployed to https://soniainigo.pingu93.com"