import { NextRequest, NextResponse, after } from "next/server";
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
      // `after` keeps this work alive once the response has been sent. A bare
      // fire-and-forget promise is dropped by the Next.js runtime when the
      // response completes, which silently skipped both the Sheet sync and
      // the notification email.
      after(async () => {
        let synced = false;
        try {
          const res = await fetch(webhookUrl, {
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
          });
          if (!res.ok) {
            throw new Error(`webhook responded with ${res.status}`);
          }
          synced = true;
        } catch (e) {
          console.error("Sheet sync failed:", e);
        }

        await sendNotification(
          synced
            ? `Address synced — ${displayName}`
            : `FAILED: Sheet sync for ${displayName}`,
          synced
            ? `${displayName}'s address was added to Google Sheets.\n\n${addressSummary}`
            : `Failed to sync ${displayName}'s address to Google Sheets.\n\nAddress (add manually):\n${addressSummary}`
        ).catch((e) => console.error("Email notification failed:", e));
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
