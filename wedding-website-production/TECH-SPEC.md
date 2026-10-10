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

## 5. Suggested Folder Structure

```
wedding-website/
├── app/
│   ├── page.tsx
│   ├── rsvp/page.tsx
│   ├── schedule/page.tsx
│   └── api/rsvp/route.ts
├── components/
├── public/
├── data/               # SQLite db (mounted volume)
├── Dockerfile
├── docker-compose.yml
├── package.json
└── tailwind.config.ts
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

## 11. Next Steps

1. Fill in real content in the existing pages.
2. Test RSVP submission on staging, verify Google Sheet receives the row.
3. Update placeholder cards/events with La Toundra details.
4. Once happy, merge `develop` → `master` and run `scripts/deploy-prod.sh`.
5. Decide on long-term domain and any extra features.

---

*Document updated Oct 2026 with self-hosted Next.js stack decisions.*
