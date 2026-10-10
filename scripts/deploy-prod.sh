#!/usr/bin/env bash
# Merge `develop` into `master` and deploy the production container.
#
# This script lives in scripts/ rather than inside wedding-website-production/
# on purpose: that folder is archived into wedding-website-staging/ by
# deploy-staging.sh, so a deploy script kept there gets copied along with it
# and shows up twice.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$REPO_ROOT"

git fetch origin
git checkout master
git merge origin/develop --no-edit
git push origin master

docker compose up -d --build wedding-website
echo "Production deployed to https://soniainigo.pingu93.com"