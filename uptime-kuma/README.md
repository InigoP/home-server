# Uptime Kuma

Self-hosted monitoring tool — like a private UptimeRobot.

- **URL:** https://uptime.pingu93.com
- **Image:** `louislam/uptime-kuma:latest`
- **Port:** 3001 (internal only, via Traefik)
- **Data:** `./data` (SQLite database, monitor configs, settings)

## Features

- HTTP(s), TCP, ping, DNS, and push monitors
- Status page (public or private)
- Notifications via Discord, Telegram, email, Slack, and many more
- Multi-user support with 2FA
- Docker container monitoring
- SSL certificate expiry monitoring

## Notes

- First-run creates an admin account via the web UI
- Data persists in `./data` — back this up to preserve monitors and history
