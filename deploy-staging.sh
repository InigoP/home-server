#!/usr/bin/env bash
set -euo pipefail
cd ~/home-server
git pull origin develop
# Sync staging folder with the wedding-website-production code on the develop branch
git archive develop:wedding-website-production | tar -x -C wedding-website-staging
docker compose up -d --build staging-website
echo "Staging deployed to https://staging.soniainigo.pingu93.com"
