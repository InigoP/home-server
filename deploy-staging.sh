#!/usr/bin/env bash
set -euo pipefail
cd ~/home-server-staging
git pull origin develop
docker compose up -d --build staging-website
echo "Staging deployed to https://staging.soniainigo.pingu93.com"
