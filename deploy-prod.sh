#!/usr/bin/env bash
set -euo pipefail
cd ~/home-server
git checkout master
git merge develop --no-edit
git push origin master
docker compose up -d --build wedding-website
echo "Production deployed to https://soniainigo.pingu93.com"
