<p align="center">
<img src="../_utilities/pihole.svg.png" width="200" alt="pihole" title="pihole" />
</p>

# About

Pi-hole is a **network-wide ad blocker**. It works as a special directory assistant
(a "DNS server"): every device on your network asks it *"what's the address of
this website?"*, and if that website is known to serve ads or trackers, Pi-hole
simply answers *"never heard of it"*. The ad is never downloaded — it is blocked
before it ever leaves the internet.

Because it sits in the middle of the network, you only have to set it up **once**
and every device on your Wi-Fi (phones, laptops, smart TVs) is protected. No
software to install on each device.

# Table of Contents

- [About](#about)
- [Files structure](#files-structure)
- [Information](#information)
  - [What it does](#what-it-does)
  - [How the pieces work](#how-the-pieces-work)
  - [The two networks](#the-two-networks)
- [Usage](#usage)
  - [1. Create the networks](#1-create-the-networks)
  - [2. Configure the password](#2-configure-the-password)
  - [3. Start the container](#3-start-the-container)
  - [4. Verify DNS and blocking](#4-verify-dns-and-blocking)
  - [5. Reserve your server's IP (Eero)](#5-reserve-your-servers-ip-eero)
  - [6. Tell the router to hand out Pi-hole (Eero)](#6-tell-the-router-to-hand-out-pi-hole-eero)
  - [7. Open the admin dashboard](#7-open-the-admin-dashboard)
  - [8. Configure blocklists and upstream DNS](#8-configure-blocklists-and-upstream-dns)
- [What it can and cannot block](#what-it-can-and-cannot-block)
- [VPN note](#vpn-note)
- [Port forwarding note](#port-forwarding-note)
- [Troubleshooting](#troubleshooting)
- [Update](#update)
- [Backup](#backup)

# Files structure

```
pihole/
├── docker-compose.yml     # the service definition (ports, networks, labels)
├── .env                   # user-specific variables (password, timezone) - gitignored
├── etc-pihole/            # Pi-hole's memory: config, blocklists, query history
└── etc-dnsmasq.d/         # optional custom dnsmasq config files
```

# Information

## What it does

Imagine a phone book for the internet. Every time a device wants to visit a
website it first asks: *"where is `example.com`?"*. Pi-hole keeps that phone
book **and a blacklist**:

```
Your phone:  "where is coolwebsite.com?"
Pi-hole:     "here's the address"          ✅  page loads

Your phone:  "where is track-me-ads.net?"
Pi-hole:     "never heard of it"           🚫  ad never arrives, 0 bytes downloaded
```

It is completely passive: it never grabs traffic, changes routes, or touches the
firewall. A device that doesn't use it as its directory service is never affected.

## How the pieces work

| Line in the compose file | What it means, in plain terms |
|---|---|
| `image: pihole/pihole:latest` | The Pi-hole software itself, run as a Docker container |
| `ports: 53:53/tcp` and `53:53/udp` | Opens the "phone line" for directory questions. Without this, nobody on your LAN can ask Pi-hole anything. Port 53 is the standard DNS port |
| `FTLCONF_webserver_api_password` | The lock on the admin dashboard (read from `.env`) |
| `FTLCONF_dns_listeningMode: 'all'` | Answer questions on **all** network interfaces, not just inside the container — required so LAN clients get answers |
| `TZ` | Timezone for logs and graphs |
| `./etc-pihole:/etc/pihole` | Saves Pi-hole's memory to disk. Without it, restarting the container wipes your blocklists and history |
| `ipv4_address: 172.31.0.2` | A fixed internal address, so DNS answers and routes stay stable across restarts |
| `cap_add: NET_ADMIN / SYS_TIME / SYS_NICE` | Extra permissions for optional features: acting as a DHCP server, reading the system clock, and asking for more CPU priority |
| Traefik labels | Tells the reverse proxy: serve this container at `https://pihole.pingu93.com` with a real HTTPS certificate |

## The two networks

| Network | Purpose |
|---|---|
| `pihole_net` (static `172.31.0.2`) | The private wire used for DNS itself |
| `proxy` | The shared wire with Traefik, so the admin dashboard can be routed and given HTTPS |

Both are **external** networks, meaning they are created once with
`docker network create ...` and shared by all the compose files in this repo.

# Usage

## 1. Create the networks

Only needed once per machine (skip if `docker network ls` already shows them):

```bash
docker network create proxy
docker network create pihole_net
```

## 2. Configure the password

Edit `.env` in this folder and set a real password (the one you'll type into the
dashboard). Keep this file private — it is gitignored on purpose.

```
TZ=America/Los_Angeles
PASSWORD="your-strong-password-here"
```

## 3. Start the container

```bash
cd pihole
docker compose up -d
docker logs -f pihole     # Ctrl+C to stop watching the logs
```

> Pi-hole is **not** wired into the root `docker-compose.yml`, so it is started
> from its own folder. Add an `extends` block there if you want it to start with
> the rest of the stack.

## 4. Verify DNS and blocking

From the server:

```bash
dig +short @127.0.0.1 google.com        # should return a real IP address
dig +short @127.0.0.1 doubleclick.net   # should return 0.0.0.0 (blocked!)
```

If both behave that way, Pi-hole is working.

## 5. Reserve your server's IP (Eero)

Pi-hole's address must **never change**, or the whole network loses DNS. Your
server's details (check with `ip link show` and `hostname`):

- Name: `potatoe-salad-XPS-13-9380`
- MAC address: `9c:b6:d0:9b:6b:83`
- IP to pin: `192.168.4.67`

In the **Eero app**:

1. **Settings** → **Network settings** → **Reservations & Port Forwarding**
2. **Add a Reservation** → pick your server from the device list
3. Set the IP address to `192.168.4.67` → **Save**

No port forwarding entries are needed here (see [Port forwarding note](#port-forwarding-note)).

## 6. Tell the router to hand out Pi-hole (Eero)

This is the step that actually turns ad-blocking on for the whole network:

1. **Settings** → **Advanced networking** → **DNS**
2. Toggle on **Custom DNS**
3. Under IPv4 enter: `192.168.4.67`
4. **Save** — the network reboots for ~30-60 seconds (Wi-Fi drops briefly, that's normal)

> **eero Plus users:** disable *Security & privacy → Network Controls → Advanced
> Security and Ad Blocking* first. Those features hijack DNS and will override
> your custom setting (and fight with Pi-hole).

Then on each device, forget/rejoin Wi-Fi (or toggle Wi-Fi) so it picks up the
new lease.

## 7. Open the admin dashboard

**<https://pihole.pingu93.com/admin/login>**

Log in with `PASSWORD` from `.env`. Useful pages:

- **Query Log** — every DNS question in real time, with a block/allow button per entry
- **Dashboard** — statistics: total queries, % blocked, top clients, top domains
- **Settings → DNS** — where your queries go when not blocked (upstream resolvers)

## 8. Configure blocklists and upstream DNS

- **Adlists** (Group Management → Adlists): a default list (Steven Black, ~200k
  domains) is already loaded. Add more URLs if you want, then run **Update Gravity**.
- **Upstream DNS** (Settings → DNS): defaults are fine (Cloudflare/Google). Pick
  whichever you trust.

Test blocking with <https://blockads.test.trustedsite.com>.

# What it can and cannot block

| ✅ Blocked | ❌ Not blocked |
|---|---|
| Ads in web browsers (Safari, Chrome, Firefox) | Ads inside phone apps (Instagram, free games) — they come from the same address as the app itself, so blocking would break the app |
| Trackers and telemetry ("phoning home") | YouTube ads — served from `youtube.com` itself |
| Malware/phishing domains (on the blocklists) | Anything while a **VPN** is active on that device (the VPN takes over DNS) |
| Smart-TV data collection | Mobile data (Pi-hole only works on your Wi-Fi) |
| Devices you can't install software on | DNS-over-HTTPS if a user hardcodes it (Firefox/Chrome "Secure DNS") |

# VPN note

Pi-hole never breaks a VPN, because it doesn't intercept anything — it only
answers questions it is asked:

- **A laptop using a work VPN:** the VPN pushes its own DNS, which takes over
  while it's connected. VPN works fine; ad-blocking pauses for that device only.
- **Remote users connecting *into* your server (WireGuard):** set the VPN's DNS
  to `172.31.0.2` and remote clients get ad-blocking too. Listening mode `all`
  already allows this.
- **The one thing that breaks VPNs:** forcing/hijacking all port-53 traffic with
  router or firewall rules, so internal VPN names get sent to Pi-hole and fail
  to resolve. **This setup does not do that.**

# Port forwarding note

Two different things share the word "port":

- The compose file's `ports: 53:53` opens port 53 **on your server** so your own
  LAN devices can use it. ✅ Required.
- **Router port forwarding** sends internet strangers into your home network.
  ❌ Never forward port 53 — your Pi-hole would become a public open resolver,
  and attackers use those to relay DDoS attacks *with your IP as the sender*.

No port forwarding is needed for Pi-hole at all. Optionally, a single
`TCP 443 → 192.168.4.67` rule on the router makes every Traefik service
(dashboard included) reachable from outside your home — but that's a choice,
not a requirement.

# Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| `dig @127.0.0.1` works but other devices can't resolve | Port 53 not published, or device didn't get the new DNS lease — rejoin Wi-Fi |
| Internet stops working entirely on the LAN | Server is off, or DNS was changed but Pi-hole is down: `docker ps`, `docker logs pihole`. Temporarily set Eero DNS back to automatic to restore service |
| Dashboard unreachable | Check Traefik sees the router: `docker logs traefik \| grep pihole`. The container must be on the `proxy` network |
| Ads still appearing | Check the Query Log — if the domain isn't listed, it's an in-app/YouTube ad (see [what it cannot block](#what-it-can-and-cannot-block)) |
| Nothing in Query Log | Devices aren't using Pi-hole yet — confirm Eero custom DNS is set and devices reconnected |
| Container keeps restarting | `docker logs pihole` — usually port 53 already in use by another DNS service (systemd-resolved) |

# Update

Pi-hole has the Watchtower label, so it is updated automatically every Monday at
4 AM along with the other services.

Manual update:

```bash
cd pihole
docker compose pull
docker compose up -d
```

# Backup

The entire state lives in `./etc-pihole` (config, gravity/blocklists database,
query history, TLS certificate). Back up this folder and you can rebuild
Pi-hole anywhere by starting the container with the same folder mounted.

```bash
tar -czf pihole-backup-$(date +%F).tar.gz pihole/etc-pihole pihole/etc-dnsmasq.d
```

> Note: the `pihole/` folder is currently **untracked** in git (`git status`
> shows `?? pihole/`). `.env` is ignored on purpose (it holds your password),
> but consider committing `docker-compose.yml` so the setup is reproducible.
