import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, attending, welcome_party, dietary } = body;

    if (!name || !attending) {
      return NextResponse.json(
        { error: "name and attending are required" },
        { status: 400 }
      );
    }

    if (attending !== "yes" && attending !== "no") {
      return NextResponse.json(
        { error: "attending must be 'yes' or 'no'" },
        { status: 400 }
      );
    }

    if (welcome_party && welcome_party !== "yes" && welcome_party !== "no") {
      return NextResponse.json(
        { error: "welcome_party must be 'yes' or 'no'" },
        { status: 400 }
      );
    }

    const stmt = db.prepare(`
      INSERT INTO rsvps (name, email, attending, welcome_party, dietary)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(name, email || null, attending, welcome_party || null, dietary || null);

    // Fire-and-forget sync to Google Sheet
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: email || "",
          attending,
          welcome_party: welcome_party || "",
          dietary: dietary || "",
          submitted_at: new Date().toISOString(),
        }),
      }).catch((e) => console.error("Sheet sync failed:", e));
    }

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
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
