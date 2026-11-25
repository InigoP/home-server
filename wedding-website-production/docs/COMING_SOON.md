# Coming Soon mode

Controls whether visitors see the real site or a "Coming Soon" landing page.
Driven by one environment variable, with an exception for staging.

## How to toggle

Set `COMING_SOON=true` in your environment (or `docker-compose.yml`) to hide
the site behind the landing page. Set it to `false` or unset it to show the
real site.

**Exception**: when the request's `Host` header starts with `staging.`, the
landing page is skipped regardless of the env var. This lets you preview the
real site on staging even while production is behind "Coming Soon."

```yaml
# docker-compose.yml
environment:
  - COMING_SOON=true
```

Restart the container for the change to take effect.

## How it works

Three pieces wire this together:

1. **`middleware.ts`** — runs at the edge before any page renders. Reads the
   `Host` header, checks `COMING_SOON`, and rewrites traffic to
   `/coming-soon` when the condition is met.

2. **`app/coming-soon/page.tsx`** — the landing page itself. Renders
   `components/ComingSoon.tsx`.

3. **`components/Nav.tsx`** — hides itself when the current path is
   `/coming-soon`, so the landing page gets the full-screen treatment.

### Why middleware (not layout)

Earlier, this check lived in `app/layout.tsx` and called `headers()`.
Reading request headers in a layout marks every page as **dynamic** in
Next.js. Dynamic pages have a client-side Router Cache `staleTime` of 0,
which means the browser re-validates them on every navigation after even a
brief idle period. The symptom was a visible "flush" / refresh of the
current page right before a view transition to the next page.

Middleware runs separately from page rendering and doesn't force any page
to be dynamic. With the header check moved out, all pages stay static and
cache in the browser for 5 minutes, so navigation stays smooth.

## Troubleshooting

- **Staging shows the landing page**: check that the `Host` header actually
  starts with `staging.`. If you're accessing through a tunnel/proxy, the
  Host may be different.
- **Everyone sees the landing page**: unset `COMING_SOON` and restart.
- **Landing page shows Nav**: `Nav.tsx` should return `null` when
  `pathname === "/coming-soon"`. Confirm the pathname matches exactly.
- **Transition flash is back**: something new in a layout is reading
  headers/cookies or marking the route dynamic. Grep for `headers()`,
  `cookies()`, or `export const dynamic = 'force-dynamic'`.
