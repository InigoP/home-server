import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

type GuestRow = { id: number; first_name: string; last_name: string; group_id: number | null };
type RsvpRow = { welcome_party: string | null; wedding: string | null; dietary: string | null };

function getExistingRsvp(first: string, last: string): RsvpRow | null {
  return (db.prepare(`
    SELECT welcome_party, wedding, dietary FROM rsvps
    WHERE LOWER(first_name) = LOWER(?) AND LOWER(last_name) = LOWER(?)
    ORDER BY created_at DESC LIMIT 1
  `).get(first, last) as RsvpRow | undefined) ?? null;
}

export async function GET(req: NextRequest) {
  const first = req.nextUrl.searchParams.get("first")?.trim();
  const last = req.nextUrl.searchParams.get("last")?.trim();

  if (!first || !last) {
    return NextResponse.json({ error: "first and last are required" }, { status: 400 });
  }

  const guest = db.prepare(`
    SELECT id, first_name, last_name, group_id FROM guests
    WHERE LOWER(first_name) = LOWER(?) AND LOWER(last_name) = LOWER(?)
  `).get(first, last) as GuestRow | undefined;

  const existingRsvp = getExistingRsvp(first, last);

  if (!guest || !guest.group_id) {
    return NextResponse.json({ found: !!guest, party: [], existingRsvp, partyExistingRsvps: [] });
  }

  const partyRows = db.prepare(`
    SELECT first_name, last_name FROM guests
    WHERE group_id = ? AND id != ?
  `).all(guest.group_id, guest.id) as Pick<GuestRow, "first_name" | "last_name">[];

  const party = partyRows.map((r) => ({ firstName: r.first_name, lastName: r.last_name }));
  const partyExistingRsvps = partyRows.map((r) => getExistingRsvp(r.first_name, r.last_name));

  return NextResponse.json({ found: true, party, existingRsvp, partyExistingRsvps });
}
