import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { sendNotification } from "@/lib/email";

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

    // Check for an existing record by name so a resubmission updates in place
    const existing = db.prepare(
      "SELECT id FROM addresses WHERE first_name = ? AND last_name = ?"
    ).get(first_name, last_name) as { id: number } | undefined;

    let id: number;
    if (existing) {
      db.prepare(`
        UPDATE addresses
        SET address1 = ?, address2 = ?, city = ?, state = ?, zip = ?, country = ?,
            created_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(address1, address2 || null, city, state, zip, country, existing.id);
      id = existing.id;
    } else {
      const result = db.prepare(`
        INSERT INTO addresses (first_name, last_name, address1, address2, city, state, zip, country)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(first_name, last_name, address1, address2 || null, city, state, zip, country);
      id = Number(result.lastInsertRowid);
    }

    // Fire webhook + email after the DB write; never blocks the guest's response
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    const displayName = `${first_name} ${last_name}`;
    const addressSummary = [address1, address2, city, state, zip, country]
      .filter(Boolean)
      .join(", ");

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
      })
        .then(() =>
          sendNotification(
            `Address synced — ${displayName}`,
            `${displayName}'s address was added to Google Sheets.\n\n${addressSummary}`
          ).catch((e) => console.error("Email notification failed:", e))
        )
        .catch((e) => {
          console.error("Sheet sync failed:", e);
          sendNotification(
            `FAILED: Sheet sync for ${displayName}`,
            `Failed to sync ${displayName}'s address to Google Sheets.\n\nError: ${e}\n\nAddress (add manually):\n${addressSummary}`
          ).catch((emailErr) => console.error("Email notification failed:", emailErr));
        });
    }

    return NextResponse.json({ success: true, id });
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
