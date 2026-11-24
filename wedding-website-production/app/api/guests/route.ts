import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

function authorized(req: NextRequest) {
  return req.nextUrl.searchParams.get("token") === process.env.RSVP_ADMIN_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const rows = db.prepare("SELECT * FROM guests ORDER BY group_id, last_name, first_name").all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { first_name, last_name, group_id } = body;

  if (!first_name?.trim() || !last_name?.trim()) {
    return NextResponse.json({ error: "first_name and last_name are required" }, { status: 400 });
  }

  const result = db.prepare(`
    INSERT INTO guests (first_name, last_name, group_id)
    VALUES (?, ?, ?)
  `).run(first_name.trim(), last_name.trim(), group_id ?? null);

  return NextResponse.json({ success: true, id: result.lastInsertRowid });
}

export async function DELETE(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  db.prepare("DELETE FROM guests WHERE id = ?").run(id);
  return NextResponse.json({ success: true });
}
