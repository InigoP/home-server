# Home Server Guide — explained in plain English

Everything in this repository, what it does, and how to look after it — no
technical background required.

- [Pi-hole setup →](pihole/README.md) (the ad blocker, step by step)

---

## 1. The big picture

You own a **laptop-turned-server** that runs a bunch of small programs in
boxes (Docker containers). Together they give you:

1. **Ad-blocking for your whole Wi-Fi** (Pi-hole)
2. **Your own Netflix** — movies & TV you own, streamed to any device (Jellyfin)
3. **A "download anything" pipeline** — ask for a show, and it finds, downloads,
   subtitles, and organizes it automatically (*arr apps + qBittorrent)
4. **One secure front door** — every service gets its own web address with a
   padlock (Traefik), instead of memorizing port numbers
5. **Automatic updates** for all of it (Watchtower)

Think of it as a small private datacenter under your desk.

---

## 2. Your gear and network

| Thing | What it is | Value |
|---|---|---|
| Server | Dell XPS 13 9380 laptop, hostname `potatoe-salad-XPS-13-9380` | — |
| Server's address on your LAN | Fixed via Eero reservation (see Pi-hole guide) | `192.168.4.67` |
| Router | **Eero** mesh Wi-Fi, managed only through the phone app | `192.168.4.1` |
| Your network range | Where all your devices live | `192.168.4.0/22` |
| Public IP | Your house's address on the internet | `47.144.152.40` |
| Domain | The name you rent so services get nice URLs | `pingu93.com` (Cloudflare) |
| Big external hard drive | Where all media and downloads live | `/mnt/mypassport/Media_Server` |

---

## 3. The building blocks (plain-English glossary)

**Docker** — a way to run programs in portable boxes. Each box has everything the
program needs, so nothing conflicts with anything else on the server. Uninstalling
is throwing away the box.

**Image** — the recipe for a box. `jellyfin/jellyfin:latest` means "the latest
recipe of Jellyfin".

**Container** — an actual running box made from a recipe.

**Docker Compose** — a YAML file that says *"here's all the boxes I want, and how
they hook up"*. One command (`docker compose up -d`) builds the whole setup.

**Volume** — a box's permanent storage. `./config:/config` means "everything the
program saves goes into my `config` folder, so it survives if the box is recreated".
Delete the container = fine; delete the volume folder = settings/history gone.

**Network** — a private wire between boxes. Two exist here (see below).

**`.env` file** — a list of your private variables (passwords, domain, timezone)
so the compose files can stay public while your secrets don't. All `*.env` files
are **gitignored** on purpose.

**Reverse proxy (Traefik)** — the receptionist. Visitors arrive asking for
`https://radarr.pingu93.com`, and it routes them to the right box.

**TLS certificate (HTTPS)** — the padlock. Traefik gets one automatically from
Let's Encrypt and renews it forever.

**DNS** — the phone book that turns names into numbers. Pi-hole *is* your phone
book.

---

## 4. The two private wires (networks)

| Network | Who's on it | Job |
|---|---|---|
| `proxy` | Traefik + every service | Lets the receptionist reach the services |
| `pihole_net` | Pi-hole (static `172.31.0.2`) | The DNS wire, fixed address so answers never drift |

Both are **external**: created once with `docker network create proxy` /
`docker network create pihole_net`, then shared by every compose file.

---

## 5. Traefik — your front door

Only ports **80** (HTTP) and **443** (HTTPS) are open on the server. Everything
else stays hidden inside Docker.

How a request flows:

```
Your browser: https://radarr.pingu93.com
      ↓ internet / Wi-Fi
Eero router → forwards port 443 to 192.168.4.67   (only if you choose to)
      ↓
Traefik (the receptionist)
      ↓ "ah, radarr.pingu93.com? that's the radarr box"
Radarr answers
      ↓
Padlock: certificate fetched automatically from Let's Encrypt,
         validated through Cloudflare (you never touch it again)
```

Two helpers make this safe:

- **socket-proxy** — Traefik never touches the raw Docker socket; it asks a tiny
  guard container instead (a compromised proxy can't take over the server).
- **`rules/whitelist.yml`** — an IP allowlist, currently disabled
  (`0.0.0.0/0` = everyone). If you only want services reachable from home or via
  VPN, put `192.168.4.0/24` (and/or `172.16.0.0/12` for VPN) in here and attach
  the `whitelist@file` middleware to your routers.

---

## 6. Every service, one by one

| URL | Service | Plain-English job | Folder | In root compose? |
|---|---|---|---|---|
| `https://pihole.pingu93.com/admin/login` | **Pi-hole** | Network-wide ad blocker + your DNS phone book | `pihole/` | ❌ own folder |
| — | **Traefik** | Front door: routes URLs → boxes, handles padlocks | `traefik/` | ✅ |
| — **socket-proxy** | Guard between Traefik and Docker | `traefik/` | ✅ |
| `https://jellyfin.pingu93.com` | **Jellyfin** | Your personal Netflix: plays your movies/TV on any device | `jellyfin/` | ✅ |
| `https://jellyseerr.pingu93.com` | **Jellyseerr** | Pretty request page: "I want to watch X" — the starting pistol | `jellyseer/` | ✅ |
| `https://prowlarr.pingu93.com` | **Prowlarr** | Keeps the list of torrent/usenet sources up to date | `prowlarr/` | ✅ |
| `https://radarr.pingu93.com` | **Radarr** | Movie butler: finds & imports movies | `radarr/` | ✅ |
| `https://sonarr.pingu93.com` | **Sonarr** | TV butler: finds & imports episodes | `sonarr/` | ✅ |
| `https://bazarr.pingu93.com` | **Bazarr** | Subtitle butler: downloads subtitles for your library | `bazarr/` | ✅ |
| `https://qbit.pingu93.com` | **qBittorrent** | The actual downloader (torrent client) | `qbittorrent/` | ✅ |
| — | **Watchtower** | Nightly babysitter: updates the other boxes | `watchtower/` | ❌ own folder |
| `https://...` | **Transmission** | An alternative torrent client, present but not currently running | `transmission/` | ❌ own folder |

> Services marked ❌ are started from their own folder
> (`cd pihole && docker compose up -d`), because the root `docker-compose.yml`
> doesn't include them.

### How the media pipeline works

One request flows through the whole crew automatically:

```
You tap "Request" in Jellyseerr
        ↓
Prowlarr  →  asks the sources: "who has Season 3 of X?"
        ↓
Sonarr    →  "I want episode 4, quality 1080p"
        ↓
qBittorrent  →  downloads it to /mnt/mypassport/Media_Server/torrents
        ↓
Sonarr    →  notices the finished file, renames it, moves it into the library
        ↓
Bazarr    →  grabs subtitles for it
        ↓
Jellyfin  →  it now just appears in your library, ready to watch
```

You only ever touch **Jellyseerr** (to ask) and **Jellyfin** (to watch). The
rest is plumbing.

---

## 7. Pi-hole — the ad blocker

Full step-by-step: **[pihole/README.md](pihole/README.md)**

In one paragraph: Pi-hole is the network's phone book. Every device asks it
where websites live; if a website is on a blocklist (~200k ad/tracker domains),
it answers *"never heard of it"* and the ad never downloads. You enable it by
telling your Eero router "hand out `192.168.4.67` as the DNS server" — done once,
every device on your Wi-Fi is covered.

---

## 8. Everyday operations

### Start everything

```bash
cd ~/home-server
docker compose up -d          # the main stack (traefik + media crew)

cd pihole && docker compose up -d && cd ..
docker ps                     # confirm what's running
```

### Stop everything

```bash
docker compose down            # stops and removes the boxes (data stays in volumes)
```

### See what's happening

```bash
docker logs -f radarr          # live log of one service, Ctrl+C to exit
docker ps                      # list running boxes + which ports are open
```

### Update

- **Automatic:** Watchtower runs **Mondays at 4 AM** and updates anything
  labeled `com.centurylinklabs.watchtower.enable=true` (all services here), then
  notifies Gotify. ⚠️ Its `.env` still has placeholder credentials
  (`GOTIFY_TOKEN=xxxx`), and no Gotify server exists in this repo — so updates
  happen but notifications don't. Also note Watchtower itself must be started
  from `watchtower/` (it's not in the root compose).
- **Manual:**
  ```bash
  docker compose pull     # download newer recipes
  docker compose up -d    # rebuild the boxes with them
  ```

### Backup

The `config` folder next to each service holds all its settings and history.
The media itself lives on `/mnt/mypassport/Media_Server`. A minimal safety net:

```bash
tar -czf home-server-configs-$(date +%F).tar.gz */config */.env pihole/etc-pihole
```

Do it on a schedule (cron) or add the borg-backup tool the original guide
mentions if you want off-site backups.

---

## 9. Security — what's exposed and what to know

1. **Only 80/443 are open** on the server (Traefik). Everything else — database
   ports, qBittorrent's web UI, Sonarr's port — is unreachable from outside
   unless someone is already inside your Wi-Fi.
2. **Never forward port 53** on the router (Pi-hole/DNS). Open resolvers get
   abused for attacks, and *your* IP is the sender.
3. **Port 443 forwarding is optional.** Forward `TCP 443 → 192.168.4.67` only if
   you want dashboards reachable from outside home. One rule covers *all*
   services. Leave it off for a home-only setup.
4. **Secrets live in `.env` files**, which are gitignored. Keep it that way —
   your root `.env` holds a real **Cloudflare API key**, which can edit your
   entire domain's DNS. Rotate it if it ever leaks.
5. **Every dashboard has a login**, but they're not all equal: set strong
   passwords, especially on qBittorrent, Sonarr/Radarr (they can execute
   downloads) and Pi-hole.
6. **Docker bypasses UFW.** If you use Uncomplicated Firewall, published ports
   are still reachable from outside — the classic mistake. The
   [ufw-docker](https://github.com/chaifeng/ufw-docker) project fixes this.
7. **The whitelist is off** (`0.0.0.0/0` in `traefik/rules/whitelist.yml`).
   If services should only be reachable from your LAN/VPN, turn it on.
8. **HTTPS everywhere** — Traefik auto-redirects HTTP→HTTPS and forces modern
   TLS (v1.2+/1.3) via `traefik/rules/tls.yml`.

---

## 10. When something breaks

| Symptom | First thing to check |
|---|---|
| A URL shows Traefik error / 404 | `docker ps` — is that service running? Then `docker logs traefik \| grep <service>` |
| Whole internet "doesn't work" on Wi-Fi | Pi-hole is your DNS now. Is the server on? `docker ps` should show `pihole`. Emergency fix: set Eero DNS back to automatic |
| No padlock / cert error | `docker logs traefik \| grep -i acme` — first issuance can take a couple of minutes |
| Downloads not starting | qBittorrent port `6881` must be reachable: check Eero port forwarding if you want torrents from outside |
| Service lost its settings | Its `config` folder was deleted — restore from backup |
| Something won't start (port in use) | `docker ps` — two boxes claiming the same port |
| Pi-hole not blocking | Query Log empty? Devices didn't pick up the new DNS — rejoin Wi-Fi |

Golden commands:

```bash
docker ps                 # what's up?
docker logs -f <name>     # what's it saying?
docker compose up -d      # reconcile to the compose file
```

---

## 11. File map

```
home-server/
├── docker-compose.yml      # root stack: traefik + socket-proxy + media crew
├── .env                    # domain, Cloudflare key, timezone, URLs (gitignored)
├── HOME-SERVER-GUIDE.md    # this document
├── traefik/                # front door: traefik.yml, rules/, certs, README
├── pihole/                 # ad blocker (own compose + its README)
├── jellyfin/               # your Netflix
├── jellyseer/              # request page
├── prowlarr/               # source lists
├── radarr/                 # movies
├── sonarr/                 # TV
├── bazarr/                 # subtitles
├── qbittorrent/            # downloader
├── transmission/           # alternative downloader (not in root stack)
├── watchtower/             # auto-updater (own compose)
└── _utilities/             # logos/icons used in the docs
```

Each folder is self-contained: `cd` into it, edit its `.env` if needed, and
`docker compose up -d`. They all share the same `proxy` network so Traefik can
find them.
