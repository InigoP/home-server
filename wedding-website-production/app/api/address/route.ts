import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { first_name, last_name, address1, address2, city, state, zip, country } = body;

    if (!first_name || !last_name || !address1 || !city || !state || !zip || !country) {
      return NextResponse.json(
        { error: "first_name, last_name, address1, city, state, zip, and country are required" },
        { status: 400 }
      );
    }

    const stmt = db.prepare(`
      INSERT INTO addresses (first_name, last_name, address1, address2, city, state, zip, country)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(first_name, last_name, address1, address2 || null, city, state, zip, country);

    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "address",
          first_name,
          last_name,
          address1,
          address2: address2 || "",
          city,
          state,
          zip,
          country,
          submitted_at: new Date().toISOString(),
        }),
      }).catch((e) => console.error("Sheet sync failed:", e));
    }

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "failed to save address" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (token !== process.env.RSVP_ADMIN_TOKEN) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const rows = db.prepare("SELECT * FROM addresses ORDER BY created_at DESC").all();
  return NextResponse.json(rows);
}
