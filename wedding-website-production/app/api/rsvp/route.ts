import { NextRequest, NextResponse, after } from "next/server";
import db from "@/lib/db";

type PartyMember = {
  first_name: string;
  last_name: string;
  welcome_party: string;
  wedding: string;
  dietary: string;
  song_request: string;
};

const deleteRsvp = db.prepare(`
  DELETE FROM rsvps WHERE LOWER(first_name) = LOWER(?) AND LOWER(last_name) = LOWER(?)
`);

const insertRsvp = db.prepare(`
  INSERT INTO rsvps (first_name, last_name, welcome_party, wedding, dietary, song_request)
  VALUES (?, ?, ?, ?, ?, ?)
`);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { first_name, last_name, welcome_party, wedding, dietary, song_request, party } = body;

    if (!first_name?.trim() || !last_name?.trim()) {
      return NextResponse.json({ error: "first_name and last_name are required" }, { status: 400 });
    }

    const insertMany = db.transaction((rows: PartyMember[]) => {
      for (const row of rows) {
        deleteRsvp.run(row.first_name, row.last_name);
        insertRsvp.run(
          row.first_name,
          row.last_name,
          row.welcome_party || null,
          row.wedding || null,
          row.dietary || null,
          row.song_request || null,
        );
      }
    });

    const rows: PartyMember[] = [
      { first_name: first_name.trim(), last_name: last_name.trim(), welcome_party, wedding, dietary, song_request },
      ...(Array.isArray(party) ? party.map((m: PartyMember) => ({
        first_name: m.first_name,
        last_name: m.last_name,
        welcome_party: m.welcome_party,
        wedding: m.wedding,
        dietary: m.dietary,
        song_request: m.song_request,
      })) : []),
    ];

    insertMany(rows);

    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (webhookUrl) {
      after(async () => {
        try {
          const res = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rows, submitted_at: new Date().toISOString() }),
          });
          if (!res.ok) throw new Error(`webhook responded with ${res.status}`);
        } catch (e) {
          console.error("Sheet sync failed:", e);
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "failed to save rsvp" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (token !== process.env.RSVP_ADMIN_TOKEN) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const rows = db.prepare("SELECT * FROM rsvps ORDER BY created_at DESC").all();
  return NextResponse.json(rows);
}
