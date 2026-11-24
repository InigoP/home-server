import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

type GuestRow = { id: number; first_name: string; last_name: string; group_id: number | null };

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

  if (!guest || !guest.group_id) {
    return NextResponse.json({ found: !!guest, party: [] });
  }

  const party = (db.prepare(`
    SELECT first_name, last_name FROM guests
    WHERE group_id = ? AND id != ?
  `).all(guest.group_id, guest.id) as Pick<GuestRow, "first_name" | "last_name">[])
    .map((r) => ({ firstName: r.first_name, lastName: r.last_name }));

  return NextResponse.json({ found: true, party });
}
