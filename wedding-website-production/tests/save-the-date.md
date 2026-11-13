# Save the Date — Test Plan

A manual test plan covering the full save-the-date mailing campaign flow, from address collection on the website through to physical mailing.

---

## 1. Address Collection (Website)

### Happy Path

- [ ] Fill all required fields (first name, last name, address line 1, city, state/province, ZIP, country) and submit
- [ ] Verify the success screen appears: "We have your address — your invitation will be on its way soon."
- [ ] Verify the record is saved in the SQLite database (`data/wedding.db`, `addresses` table)
- [ ] Verify the Google Sheet webhook fires and the row appears in the spreadsheet (requires `GOOGLE_SHEET_WEBHOOK_URL` env var set)

### Optional Field

- [ ] Submit with address line 2 blank — should succeed with `address2` stored as `null`
- [ ] Submit with address line 2 filled — verify it is saved correctly

### Validation

- [ ] Omit each required field one at a time and submit — the form's `required` attribute should block submission in-browser
- [ ] Send a direct `POST /api/address` with a missing required field — expect `400` with an error message listing the missing fields
- [ ] Send a `POST /api/address` with an empty body — expect `400`

### Error State

- [ ] Simulate a server error (e.g., take the DB offline) and submit — verify the error message "Something went wrong. Please try again." appears
- [ ] Verify the button returns to "Submit Address" after an error so the guest can retry

### Duplicate Submissions

- [ ] Submit the same address twice — both records are currently saved (no uniqueness constraint); confirm this is acceptable or add deduplication

---

## 2. Admin Export

- [ ] `GET /api/address?token=<RSVP_ADMIN_TOKEN>` — verify it returns all rows as JSON, sorted newest-first
- [ ] Call without a token — expect `401 unauthorized`
- [ ] Call with a wrong token — expect `401 unauthorized`

---

## 3. Data Export for Mailing

- [ ] Export the address list via the admin endpoint or directly from the DB
- [ ] Verify each record has all fields needed by your mailing vendor: first name, last name, full address, country
- [ ] Check for bad data: blank required fields that slipped through, unusually short ZIPs, missing states
- [ ] Confirm international addresses are formatted correctly for the destination country

---

## 4. Physical Mailing QA

- [ ] Send a small test batch (5–10 addresses you control) before the full send
- [ ] Confirm delivery to US addresses within expected timeline
- [ ] Confirm delivery to any international addresses
- [ ] Check that printed address formatting matches what was submitted (no truncation, special characters render correctly)

---

## 5. Edge Cases

| Scenario | What to check |
|---|---|
| Special characters in names (accents, hyphens, apostrophes) | Stored and printed correctly |
| Very long address lines | Not truncated in DB or on the printed piece |
| Apartment/unit in address line 2 | Appears on a separate line when printed |
| PO Box addresses | Accepted by form; works with your mail carrier |
| International ZIP formats (alphanumeric, spaces) | Not rejected by form validation |

---

## Known Gaps

- **Duplicate submissions** — no uniqueness constraint on the `addresses` table; a guest can submit multiple times
- **Webhook failures are silent** — if the Google Sheet sync fails, it is logged to console only and will not surface to you; verify the Sheet row count matches the DB row count before exporting for print
