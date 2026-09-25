# About

<p align="center">
<img src="../_utilities/watchtower.png" width="400" alt="watchtower" title="watchtower" />
</p>

Watchtower is a container-based solution for automating Docker container base image updates. It will pull down your new image, gracefully shut down your existing container and restart it with the same options that were used when it was deployed initially.

* [Github](https://github.com/containrrr/watchtower)
* [Documentation](https://containrrr.dev/watchtower/)
* [Docker Image](https://hub.docker.com/r/containrrr/watchtower)

# Table of Contents

<!-- TOC -->

- [About](#about)
- [Table of Contents](#table-of-contents)
- [Files structure](#files-structure)
- [Information](#information)
    - [docker-compose](#docker-compose)
- [Usage](#usage)
    - [Configuration](#configuration)
- [Update](#update)
- [Security](#security)
- [Backup](#backup)

<!-- /TOC -->

# Files structure 

```bash
.
|-- .env
`-- docker-compose.yml
```

- `.env` - a file containing all the environment variables used in the docker-compose.yml
- `docker-compose.yml` - a docker-compose file, use to configure your application’s services

Please make sure that all the files and directories are present.

# Information

The following docker-compose is configured to check for updates every Monday at
04:00. Every other service in this repository opts in with the
`com.centurylinklabs.watchtower.enable=true` label, so watchtower only ever
touches services that asked for it. If a service is missing that label, watchtower
will not update it no matter what.

It is started from the **root** `docker-compose.yml` (not from this folder), so
that one `docker compose up -d` brings up the whole stack:

```bash
docker compose up -d watchtower
```

Old images are removed after a successful update (`WATCHTOWER_CLEANUP=true`),
and when several services update in the same run they are recreated one at a time
(`WATCHTOWER_ROLLING_RESTART=true`) so the stack is never fully down.

## Report-only first

Every image in this stack was over a year out of date, so the first update run
would have been a very large jump (Sonarr, Radarr, Jellyfin and Traefik all
migrate their own databases on upgrade). `WATCHTOWER_MONITOR_ONLY=true` makes
watchtower *report* which images have an update and change nothing:

```bash
docker logs watchtower | grep -i "found new"
```

Once you are happy with the list — and have read the release notes of anything
that migrates a database — switch it off in `.env`:

```ini
WATCHTOWER_MONITOR_ONLY=false
WATCHTOWER_ROLLING_RESTART=true
```

> Watchtower refuses to start when `WATCHTOWER_ROLLING_RESTART` and
> `WATCHTOWER_MONITOR_ONLY` are both enabled, so the two always go together.

Then recreate it: `docker compose up -d watchtower`.

## Pinning a service to one version

`image: fallenbagel/jellyseerr:latest` style tags will eventually pull a major
version at you. To freeze a service, change its tag in the root compose (or in
its own folder's compose) to an explicit version and drop the watchtower label
from that service.

## Notifications

Notifications go through [shoutrrr](https://containrrr.dev/watchtower/arguments/#notifications),
so any service it supports works without a code change. The default here is a
Discord webhook: create one in Discord under *Server Settings → Integrations →
Webhooks*, then put the URL in `DISCORD_WEBHOOK_URL` in `.env` and set
`WATCHTOWER_NOTIFICATIONS=shoutrrr`.

## docker-compose
Links to the following [docker-compose.yml](docker-compose.yml) and the corresponding [.env](.env).

* docker-compose.yml
  ```yaml
  services:
    watchtower:
      # Pinned: the `latest` tag is unversioned, and an unpinned auto-updater is
      # how you end up debugging a surprise major bump. 1.7.1 is the last release.
      image: containrrr/watchtower:1.7.1
      container_name: watchtower
      restart: unless-stopped
      volumes:
        # Read-write is required: watchtower has to stop/recreate containers to
        # apply an update. See the Security note in the README.
        - /var/run/docker.sock:/var/run/docker.sock
      networks:
        - proxy
      environment:
        - TZ=${TZ}
        - WATCHTOWER_SCHEDULE=0 0 4 * * MON
        - WATCHTOWER_LABEL_ENABLE=true
        - WATCHTOWER_CLEANUP=true
        - WATCHTOWER_ROLLING_RESTART=${WATCHTOWER_ROLLING_RESTART:-false}
        - WATCHTOWER_LIFECYCLE_HOOKS=true
        - WATCHTOWER_INCLUDE_STOPPED=false
        - WATCHTOWER_MONITOR_ONLY=${WATCHTOWER_MONITOR_ONLY:-true}
        - WATCHTOWER_NOTIFICATIONS=${WATCHTOWER_NOTIFICATIONS:-}
        - WATCHTOWER_NOTIFICATION_URL=${DISCORD_WEBHOOK_URL:-}
      labels:
        - "com.centurylinklabs.watchtower.enable=true"

  networks:
    proxy:
      external: true
  ```
* .env
  ```ini
  # Discord: Server Settings -> Integrations -> Webhooks -> Copy Webhook URL
  DISCORD_WEBHOOK_URL=

  # true = report only, false = actually update
  WATCHTOWER_MONITOR_ONLY=true
  # switch both at the same time, watchtower refuses to run with both on
  WATCHTOWER_ROLLING_RESTART=false
  ```

# Usage

## Configuration

Edit the `.env` file, then from the repository root run :

```bash
docker compose up -d watchtower
```

Watchtower will then check for updates every Monday at 04:00 and, once
`WATCHTOWER_MONITOR_ONLY` is `false`, pull and recreate the opted-in services.

# Update

The image is automatically updated with [watchtower](../watchtower) thanks to the following label :

```yaml
  # Watchtower Update
  - "com.centurylinklabs.watchtower.enable=true"
```

# Security

Automatically upgrading open-source images can be a huge security risk. The safest solution would be to only [monitor](https://containrrr.dev/watchtower/arguments/#without_updating_containers) the images and check the updated image before doing the upgrade.

# Backup

Backup are not required.