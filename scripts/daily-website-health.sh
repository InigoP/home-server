#!/usr/bin/env bash
# daily-website-health.sh — check wedding website container + public URL and post to Discord.
# Runs via cron: daily 09:00.
set -euo pipefail

ENV_FILE="/home/inigo/home-server/.env"
if [[ -f "$ENV_FILE" ]]; then
  HEALTH_WEBHOOK_URL="$(grep -E '^HEALTH_WEBHOOK_URL=' "$ENV_FILE" | head -1 | cut -d= -f2-)"
fi
: "${HEALTH_WEBHOOK_URL:?HEALTH_WEBHOOK_URL not set in $ENV_FILE}"

URL="https://soniainigo.pingu93.com"
CONTAINER="wedding-website"

HTTP_CODE="$(curl -sk -o /dev/null -w '%{http_code}' "$URL" || echo 'ERR')"
CONTAINER_STATUS="$(docker ps --filter name=^/${CONTAINER}$ --format '{{.Status}}')"
UNHEALTHY="$(docker ps --filter name=^/${CONTAINER}$ --filter health=unhealthy --format '{{.Names}}')"

COLOR=65280
STATUS_TEXT="OK"
if [[ "$HTTP_CODE" != "200" && "$HTTP_CODE" != "304" ]]; then
  COLOR=16711680
  STATUS_TEXT="SITE DOWN (HTTP $HTTP_CODE)"
fi
if [[ -n "$UNHEALTHY" ]]; then
  COLOR=16711680
  STATUS_TEXT="$STATUS_TEXT | container unhealthy"
fi

python3 - "$HEALTH_WEBHOOK_URL" "$HTTP_CODE" "$CONTAINER_STATUS" "$STATUS_TEXT" "$COLOR" <<'PYEOF'
import json, sys, urllib.request

url, http_code, container_status, status_text, color = sys.argv[1:6]
payload = {
  "embeds": [{
    "title": "🌐 Wedding Website Daily Health",
    "color": int(color),
    "fields": [
      {"name": "URL", "value": "https://soniainigo.pingu93.com", "inline": False},
      {"name": "HTTP code", "value": http_code, "inline": True},
      {"name": "Container", "value": container_status, "inline": True},
      {"name": "Status", "value": status_text, "inline": False},
    ],
    "footer": {"text": "soniainigo.pingu93.com daily check"}
  }]
}
req = urllib.request.Request(url, data=json.dumps(payload).encode(), headers={'Content-Type': 'application/json', 'User-Agent': 'DiscordBot (https://github.com, daily-website-health)'})
urllib.request.urlopen(req)
PYEOF
