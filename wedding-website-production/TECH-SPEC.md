# Wedding Website — Tech Spec & Planning Document

> A technical planning document for designing, building, and hosting a self-hosted wedding website.

---

## 1. Goals & Requirements

### Primary Goals
- Provide guests with all key wedding info (date, venue, RSVP, schedule, travel, registry).
- Collect RSVPs and meal/dietary preferences reliably.
- Password-protect or semi-private access if desired.
- Beautiful, mobile-friendly design.
- Low ongoing cost and minimal maintenance after launch.

### Nice-to-Haves
- Photo gallery / live photo upload from guests.
- Custom domain (e.g., `alexandjordan.com` or `wedding.alexandjordan.com`).
- Countdown timer to the big day.
- Directions map, accommodation links, FAQ section.
- Guest book / well-wishes.
- Multiple event/agenda pages (rehearsal dinner, brunch, etc.).

### Non-Goals
- Complex e-commerce or payments.
- Full CMS with admin UI (unless you want one).
- High availability / global CDN at launch (a simple site is fine).

---

## 2. Hosting Decision

**Self-hosted on your existing home server.**

Chosen approach:
- Next.js app in Docker
- SQLite for RSVP data (small API + SQLite)
- Subdomain of an existing domain
- Traefik for HTTPS/routing (already in `~/home-server`)

Reasons:
- Reuses your Docker/Traefik home-server stack
- Full control over data and customization
- Low ongoing cost (electricity only)

---

## 3. Tech Stack Decision

| Layer | Chosen |
|---|---|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion (subtle scroll/hover effects) |
| RSVP backend | Next.js API route + SQLite (better-sqlite3) |
| Container | Docker (Node 20 alpine) |
| Reverse proxy | Existing Traefik |
| Domain | Subdomain of an existing domain |
| HTTPS | Let's Encrypt via Traefik |

---

## 4. Component Breakdown

### 4.1 Next.js App (`wedding-website/`)
- App Router pages: `/`, `/schedule`, `/venue`, `/travel`, `/registry`, `/rsvp`, `/faq`
- Components: `Nav`, `Hero`, `Countdown`, `Timeline`, `RSVPForm`, `Gallery`, `Footer`
- API route: `app/api/rsvp/route.ts` for RSVP POST/GET

### 4.2 Tailwind CSS
- Utility styling, responsive layout, custom wedding palette/fonts via `tailwind.config.ts`.

### 4.3 Framer Motion
- Scroll-reveal sections, hover scale on cards/buttons, animated countdown, gentle image fades.
- Keep subtle: no heavy page transitions or parallax.

### 4.4 SQLite (`better-sqlite3`)
- File: `/app/data/wedding.db` (mounted volume).
- Table: `rsvps` (id, name, email, attending, guest_count, meal, dietary, song, message, created_at).

### 4.5 RSVP API
- `POST /api/rsvp` — validate + insert.
- `GET /api/rsvp` — optional admin list (protect with a simple token).
- Optional: SMTP/Resend email notification on new RSVP.

### 4.6 Docker
- Multi-stage `Dockerfile` using `node:20-alpine`.
- Volume: `./data:/app/data` for SQLite persistence.

### 4.7 Traefik
- Labels on the service to route `wedding.yourdomain.com` to the container.
- Reuses your existing Traefik + Let's Encrypt setup.

### 4.8 Domain / DNS
- `wedding.yourdomain.com` A/CNAME to your home IP or DDNS hostname.

### 4.9 Optional Extras
- Cloudflare Turnstile or honeypot on RSVP form.
- MinIO/S3 or local volume for guest photo uploads.
- Simple countdown timer component.

---

## 5. Folder Structure

The Next.js app lives in `wedding-website-production/` at the root of the
`home-server` repo. `wedding-website-staging/` is a **generated mirror** of the
`develop` branch — never edit it, `scripts/deploy-staging.sh` recreates it on
every deploy (see §11).

```
home-server/
├── scripts/
│   ├── deploy-staging.sh     # develop → wedding-website-staging/ → staging container
│   └── deploy-prod.sh        # develop → master → production container
├── wedding-website-production/            # app source (git-tracked)
│   ├── app/
│   │   ├── layout.tsx        # loads Anton + VT323, sets the palette
│   │   ├── template.tsx      # wraps every page in the page-wipe transition
│   │   ├── globals.css       # Tailwind import, palette, grain, curtain animation
│   │   ├── page.tsx
│   │   ├── faq/ registry/ rsvp/ schedule/ venue/
│   │   └── api/rsvp/route.ts
│   ├── components/
│   │   ├── Reveal.tsx        # framer-motion scroll-in reveal
│   │   ├── ScrollAsset.tsx   # floating photostrip
│   │   └── Hero/Events/Accommodations/Gallery/Nav/FlipLink
│   ├── public/               # static assets, incl. photostrip.jpg
│   ├── data/                 # SQLite db (local dev; bind mount in prod)
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── package.json
└── wedding-website-staging/               # generated, git-ignored
    ├── data-staging/                      # staging RSVP db — survives redeploys
    └── (mirror of wedding-website-production/)
```

---

## 6. Page / Feature Plan

| Page / Section | Purpose | Notes |
|---|---|---|
| Home | Hero, date, location, CTA | Countdown timer |
| Our Story | Optional, photo timeline | Static content |
| Schedule | Ceremony, reception, events | Timeline UI |
| Venue / Travel | Map, directions, parking | Embed Google Maps or OpenStreetMap |
| Accommodation | Hotels, blocks, links | List |
| RSVP | Form for attendance, meal choice, dietary needs | Validation + email notification |
| Registry | Links to registries | External links |
| FAQ | Dress code, plus-ones, etc. | Accordion |
| Gallery | Photos | Grid / lightbox |
| Guestbook | Optional | Can be simple Disqus or static list |

---

## 7. RSVP Data Handling

Self-hosted approach chosen:
- Next.js API route saves to SQLite.
- Optional email notification via SMTP or Resend.

**Data fields to collect:**
- Guest name(s)
- Email
- Attending? (Yes/No)
- Number of guests
- Meal choice / dietary restrictions
- Song request (optional)
- Message for couple (optional)

---

## 8. Security & Privacy

- Use HTTPS everywhere (via Traefik/Let's Encrypt).
- Don't expose the full RSVP guest list publicly.
- Protect the RSVP admin GET endpoint with a simple token.
- Add a honeypot or Cloudflare Turnstile to reduce spam.
- Back up the SQLite file regularly (it's a single file — easy).

---

## 9. Cost Estimate

| Item | Cost |
|---|---|
| Domain subdomain | $0 (use existing) |
| Hosting | $0 (home server electricity) |
| Email notification service (optional) | $0–$20/year |
| **Total** | **~$0–20/year** |

---

## 10. Current Status

### Done
- [x] Self-hosted on existing home server
- [x] Next.js + Tailwind + Framer Motion stack scaffolded
- [x] RSVP API (`/api/rsvp`) with SQLite storage
- [x] RSVP form page (`/rsvp`) — name, email, attending, welcome party, dietary
- [x] Buffet service — **meal selection removed** from form, API, and schema
- [x] Google Sheets sync via Apps Script webhook (appended rows on each RSVP)
- [x] Dockerized with production Dockerfile + standalone output
- [x] Traefik routing + Let's Encrypt HTTPS at `soniainigo.pingu93.com`
- [x] Admin view removed (replaced by Google Sheets export)
- [x] Basic site framework — Nav, Hero, Events, Accommodations, Gallery, FAQ placeholders
- [x] Homepage set to Sonia & Inigo, June 7 2026, La Toundra, Montréal structure
- [x] Staging environment (`staging-website` container, `staging.soniainigo.pingu93.com`)
- [x] Manual deploy scripts (kept in `scripts/` at the repo root so they are not copied into the generated staging folder):
      - `scripts/deploy-staging.sh`
      - `scripts/deploy-prod.sh`
- [x] Git branch flow: `develop` → staging, `master` → production
- [x] Refactored folder layout:
      - `wedding-website-production/`
      - `wedding-website-staging/` (mirror of develop branch)
- [x] Pushed to GitHub repo (`github.com/InigoP/home-server`)
- [x] Full visual redesign in the neo-brutalist style: Anton + VT323 fonts,
      red `#ED2232` on black/white, film-grain texture, hard 2px borders,
      red curtain page transition (`app/template.tsx` + `.page-wipe`), scroll
      reveals (`components/Reveal.tsx`), `prefers-reduced-motion` support
- [x] Floating photostrip asset (`public/photostrip.jpg`, converted from the
      iPhone `.HEIC` original) — `components/ScrollAsset.tsx`, rises from the
      bottom-left at 45% of scroll speed with a 100ms transition
- [x] Both site containers managed from the root `home-server` compose project
- [x] Deploy scripts hardened — see §11

### Still To Do
- [ ] Replace placeholder content with real details (registry links, venue map, FAQ answers, hotel rates)
- [ ] Add wedding date/time countdown on homepage
- [ ] Choose final site styling/fonts and add real photography
- [ ] Decide whether to keep `welcome_party` as yes/no RSVP field or change wording
- [ ] Add rehearsal dinner/brunch as separate RSVP or keep as simple info page
- [ ] Consider optional plus-one count, song request, or guest message fields
- [ ] Set real `RSVP_ADMIN_TOKEN` (currently defaults to `changeme` in .env)
- [ ] Secure/restrict who can see the RSVP Google Sheet
- [ ] Backup plan for SQLite DB and Google Sheet copy
- [ ] Decide on domain strategy long-term (new root domain vs subdomain of pingu93.com)
- [ ] Optional: guest photo upload / gallery moderation
- [ ] Optional: interactive map, hotel cards with real links, countdown timer

---

## 11. Deployment Workflow

Both sites run from the **root `home-server` compose project**. The root
`docker-compose.yml` pulls in each service with `extends`, so the subfolder
compose files are fragments — never run `docker compose` from inside
`wedding-website-production/` or `wedding-website-staging/`, or you will get a
second copy of the same service under a different project name.

Branch flow: `develop` → staging, `master` → production.

### Deploying to staging

```bash
~/home-server/scripts/deploy-staging.sh
```

What it does, and why:

1. **`git fetch origin develop`** — fetch only, never merge. An earlier version
   used `git pull origin develop`, which merges `develop` into whatever branch
   is checked out; because `deploy-prod.sh` leaves the repo on `master`, that
   silently merged `develop` into `master`.
2. **Extracts `origin/develop:wedding-website-production`** into
   `wedding-website-staging/` via `git archive`, then `rsync --delete`s it into
   place. The wipe means files deleted or renamed upstream cannot linger in
   staging. `--exclude data-staging/` keeps the staging RSVP database, which is
   a bind mount and would otherwise be lost on every deploy.
3. **Removes any existing container named `staging-website`** before starting
   the new one. Both compose projects declare that `container_name`, so a
   container left behind by the wrong project would otherwise block the deploy
   with a name conflict.
4. **`docker compose up -d --build staging-website`** from the repo root.

### Deploying to production

```bash
~/home-server/scripts/deploy-prod.sh
```

Fetches, checks out `master`, merges `origin/develop`, pushes `master`, then
rebuilds the `wedding-website` container.

### Why the scripts live in `scripts/`

`wedding-website-staging/` is regenerated from `wedding-website-production/` on
every staging deploy. When the deploy scripts lived in
`wedding-website-production/`, each staging deploy copied a second copy into
`wedding-website-staging/`, so the scripts appeared twice and any edit to the
staging copy was silently discarded on the next deploy. They now live once, at
`scripts/`, alongside the health-check scripts.

### Adding static assets

Put the file in `wedding-website-production/public/` and it is served from the
site root — `public/photostrip.jpg` → `https://<host>/photostrip.jpg`. Then
commit and deploy; the file is baked into the image at build time, there is no
runtime upload.

Keep image formats web-friendly. The photostrip arrived as an iPhone `.HEIC`,
which browsers outside Safari cannot display — it was converted to `.jpg`
before being committed.

### Previewing without deploying

Node is not installed on the host, so the dev server runs in Docker using the
app's own `node:20` image:

```bash
docker build --target deps -t wedding-dev-deps ~/home-server/wedding-website-production

docker run -d --name wedding-dev -p 3000:3000 \
  -v ~/home-server/wedding-website-production:/app \
  -v /app/node_modules \
  -v /tmp/opencode/dev-data:/app/data \
  -e RSVP_ADMIN_TOKEN=devtoken \
  wedding-dev-deps npm run dev -- -H 0.0.0.0
```

Then open <http://localhost:3000>. Edits to the mounted source hot-reload.
The anonymous `/app/node_modules` volume keeps the image's installed
dependencies while the bind mount supplies the code, and the temp dir at
`/app/data` keeps dev RSVP data out of the real database.

Clean up with `docker rm -f wedding-dev && docker rmi wedding-dev-deps`.

> **Warning:** if a redesign is in progress on staging but *not* committed to
> `develop`, a staging deploy will overwrite it. Work in
> `wedding-website-production/`, or commit before deploying.

---

## 12. Next Steps

1. Fill in real content in the existing pages.
2. Test RSVP submission on staging, verify Google Sheet receives the row.
3. Update placeholder cards/events with La Toundra details.
4. Once happy, merge `develop` → `master` and run `scripts/deploy-prod.sh`.
5. Decide on long-term domain and any extra features.

---

*Document updated Oct 2026 with self-hosted Next.js stack decisions.*
