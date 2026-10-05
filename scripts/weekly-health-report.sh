#!/usr/bin/env bash
# weekly-health-report.sh — gather host + Docker stack health and post to Discord.
# Runs via cron: Fridays 09:00. Webhook URL comes from the gitignored .env.
set -euo pipefail

ENV_FILE="/home/inigo/home-server/.env"
if [[ -f "$ENV_FILE" ]]; then
  HEALTH_WEBHOOK_URL="$(grep -E '^HEALTH_WEBHOOK_URL=' "$ENV_FILE" | head -1 | cut -d= -f2-)"
fi
: "${HEALTH_WEBHOOK_URL:?HEALTH_WEBHOOK_URL not set in $ENV_FILE}"

# --- host metrics ---
UPTIME="$(uptime -p | sed 's/^up //')"
LOAD="$(cut -d' ' -f1-3 /proc/loadavg)"
MEM="$(free -h | awk '/^Mem:/ {printf "%s used / %s total (%s available)", $3, $2, $7}')"
SWAP="$(free -h | awk '/^Swap:/ {printf "%s / %s", $3, $2}')"
DISK="$(df -h / | awk 'NR==2 {printf "%s used / %s (%s)", $3, $2, $5}')"
DISK_AVAIL="$(df -h / | awk 'NR==2 {print $4}')"
REBOOT="$([ -f /var/run/reboot-required ] && echo 'YES' || echo 'no')"

# --- docker stack ---
RUNNING="$(docker ps -q | wc -l | tr -d ' ')"
UNHEALTHY="$(docker ps --filter health=unhealthy --format '{{.Names}}' | paste -sd ', ' -)"
RESTARTING="$(docker ps --filter status=restarting --format '{{.Names}}' | paste -sd ', ' -)"
[[ -z "$UNHEALTHY" ]] && UNHEALTHY="none"
[[ -z "$RESTARTING" ]] && RESTARTING="none"

# A compact table of containers with status
CONTAINERS="$(docker ps -a --format '{{.Names}}: {{.Status}}' | sed 's/  */ /g')"

# --- pick a color: green if all good, red otherwise ---
COLOR=65280   # green
if [[ "$UNHEALTHY" != "none" || "$RESTARTING" != "none" || "$REBOOT" == "YES" ]]; then
  COLOR=16711680  # red
fi

HOSTNAME="$(hostname)"
TIMESTAMP="$(date '+%Y-%m-%d %H:%M %Z')"

# Build JSON payload with python for safe escaping
python3 - "$HEALTH_WEBHOOK_URL" <<PYEOF
import json, os, urllib.request

payload = {
  "embeds": [{
    "title": f"🖥️ Weekly Health Report — {os.uname().nodename}",
    "color": $COLOR,
    "fields": [
      {"name": "Uptime", "value": "$UPTIME", "inline": True},
      {"name": "Load (1/5/15)", "value": "$LOAD", "inline": True},
      {"name": "Memory", "value": "$MEM", "inline": False},
      {"name": "Swap", "value": "$SWAP", "inline": True},
      {"name": "Disk /", "value": "$DISK (avail: $DISK_AVAIL)", "inline": False},
      {"name": "Reboot required", "value": "$REBOOT", "inline": True},
      {"name": "Containers running", "value": "$RUNNING", "inline": True},
      {"name": "Unhealthy", "value": "$UNHEALTHY", "inline": True},
      {"name": "Restarting", "value": "$RESTARTING", "inline": True},
      {"name": "Containers", "value": """${CONTAINERS}"""[:1000], "inline": False},
    ],
    "footer": {"text": "$TIMESTAMP"},
  }]
}

req = urllib.request.Request(
    "$HEALTH_WEBHOOK_URL",
    data=json.dumps(payload).encode(),
    headers={"Content-Type": "application/json", "User-Agent": "weekly-health-report/1.0"},
)
urllib.request.urlopen(req, timeout=15)
PYEOF
