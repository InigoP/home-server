# AGENTS.md

Guidance for AI agents working in this repo. Read this before changing anything.

## What this repo is

A self-hosted home server: one root Docker Compose stack (Traefik reverse proxy
+ *arr media stack + supporting services) plus a Next.js wedding website with
staging and production deployments.

Humans should start with `README.md` and `HOME-SERVER-GUIDE.md`.

## Hard rules

1. **Never edit `wedding-website-staging/`.** It is a generated mirror of the
   `develop` branch, git-ignored, and wiped by `scripts/deploy-staging.sh`.
   Edit `wedding-website-production/` instead.
2. **Never run `docker compose` from inside `wedding-website-production/` or
   `wedding-website-staging/`.** Those folders have their own compose files, so
   Compose treats them as a separate project; the duplicate service then
   collides on `container_name` with the real one. Always run Compose from the
   repo root, or use `scripts/`.
3. **Never commit secrets or runtime state.** `.env` files, `**/config/`,
   service databases, Pi-hole state, `acme.json`, and `*.pem`/`*.key` are
   git-ignored for a reason. If a value looks like a token, webhook URL, or
   password, it belongs in a `.env` file, not in a tracked file.
4. **Do not commit generated build output** (`node_modules/`, `.next/`, data
   directories). Run `git status` before finishing and keep the diff scoped.
5. **Do not delete unfamiliar files or edits** you did not create. This is a
   live server repo; uncommitted changes may be someone else's work in progress.

## Layout

```
docker-compose.yml          # root stack: extends every service's compose file
.env                        # domain, Cloudflare key, TZ, URLs, webhooks (gitignored)
scripts/                    # deploy + health-report scripts (run from repo root)
<service>/docker-compose.yml + README.md + .env
wedding-website-production/ # Next.js source (git-tracked) + its own AGENTS.md
wedding-website-staging/    # generated from develop, do not edit
```

Services in the root stack: traefik, socket-proxy, jellyfin, jellyseer, prowlarr,
radarr, sonarr, bazarr, qbittorrent, vaultwarden, uptime-kuma, watchtower,
wedding-website, staging-website.

**Not in the root stack:** `pihole/` and `transmission/` — start those from
their own folders with `docker compose up -d`.

## Compose conventions

- The root file uses `extends` to pull in each service's `docker-compose.yml`.
- **`extends` silently drops `depends_on`, `links`, and `volumes_from`** because
  they reference siblings. Any dependency must be restated in the root file.
- **`extends` resolves `${VAR}` against the root project environment**, not the
  service folder's `.env`. Variables that must come from the root `.env` have to
  be restated in the root file as well.
- All public services join the external `proxy` network and are exposed through
  Traefik labels (`traefik.http.routers.*`, entrypoint `https`, certresolver
  `mydnschallenge`). Keep that pattern for new services.
- Images mostly use `latest` and are updated by watchtower (Mondays 04:00).

## Common commands

```bash
docker network create proxy       # one-time
docker compose up -d              # bring up the root stack
docker compose up -d --build wedding-website
docker compose ps
docker compose logs -f <service>
docker compose config             # validate merged config after compose edits
```

Deploy the wedding site (never by hand-copying files):

```bash
scripts/deploy-staging.sh         # origin/develop -> staging container
scripts/deploy-prod.sh            # develop -> master -> production container
```

`deploy-staging.sh` uses `git fetch` + `git archive` + `rsync --delete` and
preserves `wedding-website-staging/data-staging/` (the staging RSVPs database).
Keep both behaviours if you touch it.

## Wedding website

- Next.js App Router + Tailwind + Framer Motion; RSVPs in SQLite
  (`data/wedding.db`, bind-mounted to `/app/data`).
- **Read `wedding-website-production/AGENTS.md` before writing app code.** The
  Next.js version has breaking changes vs. common training data.
- There is **no Node.js on the host**. Build and run the app in Docker; do not
  assume `npm`/`node` are available for verification.
- App secrets come from `.env`: `RSVP_ADMIN_TOKEN`, `GOOGLE_SHEET_WEBHOOK_URL`.
  Admin RSVP access must stay token-protected.
- Deployment details: `wedding-website-production/TECH-SPEC.md`.

## Monitoring scripts

- `scripts/daily-website-health.sh` — curls the production URL and checks the
  container, posts to Discord (`HEALTH_WEBHOOK_URL`). Runs via cron at 09:00.
- `scripts/weekly-health-report.sh` — weekly machine-health report.
- `scripts/sync-new-subtitles.sh` — re-times newly downloaded sidecar
  subtitles against the actual audio with ffsubsync (Docker), keeping a `.bak`
  of the original. Skips files already in sync. Runs via cron at 03:30.
- Both health scripts read values from the root `.env`; fail fast if a webhook
  is missing. Changing their output format may break downstream
  Discord/Sheet consumers.

## Style for service docs

Each service folder has a `README.md` in a consistent shape: **About**, **Table
of Contents**, **Files structure**, **Information**, **Usage**, **Update**,
**Backup**. Match that structure and the plain-English tone when adding or
updating docs. Keep line width similar to the surrounding file (~80 columns).

## Verifying work

- Compose edits: `docker compose config` (must parse cleanly).
- Container changes: `docker compose up -d <service>` then `docker compose ps`
  and check logs for healthy startup.
- Site changes: deploy to staging first, verify the staging URL, then promote.
- Report anything you could not verify instead of claiming success.
