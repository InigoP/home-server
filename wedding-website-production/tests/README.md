# Tests

Manual and automated tests for the wedding website's save-the-date mailing campaign flow.

## Running the tests

```bash
npm test          # run once
npm run test:watch  # watch mode (re-runs on file changes)
```

## Stack

| Package | Purpose |
|---|---|
| [Vitest](https://vitest.dev/) | Test runner and assertions |
| [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) | Component rendering and querying |
| [@testing-library/jest-dom](https://github.com/testing-library/jest-dom) | DOM matchers (e.g. `toBeDisabled`) |
| jsdom | Simulated browser environment |

## Files

### `save-the-date.md`
Manual test checklist covering the full campaign flow: address collection on the site, admin data export, and physical mailing QA. Work through this before each send.

### `api/address.test.ts`
Unit tests for the `POST /api/address` and `GET /api/address` route handlers. The database (`better-sqlite3`) and outbound webhook (`fetch`) are mocked — no real file I/O or network calls are made.

| Area | Tests |
|---|---|
| POST happy path | saves address, returns `{ success: true, id }` |
| POST optional field | `address2` stored as `null` when omitted |
| POST validation | 400 on missing required fields, 400 on empty body |
| POST webhook | fires when `GOOGLE_SHEET_WEBHOOK_URL` is set, skipped when not |
| POST error handling | 500 when the database throws |
| GET auth | 401 without token, 401 with wrong token, 200 with correct token |

### `ui/address-form.test.tsx`
Component tests for the `/address` page rendered in jsdom. The global `fetch` is stubbed so no real API calls are made.

| Area | Tests |
|---|---|
| Rendering | all required fields present, address line 2 marked optional |
| Success flow | success message shown after submission |
| In-flight state | button disabled and shows "Saving…" while request is pending |
| Error flow | error message shown on API failure, button re-enabled for retry |
| Request body | `address2` sent correctly whether filled or left blank |

### `setup.ts`
Shared Vitest setup: registers jest-dom matchers and runs RTL cleanup after every test.
