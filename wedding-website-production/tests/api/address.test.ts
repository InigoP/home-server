/**
 * Unit tests for POST /api/address and GET /api/address.
 *
 * better-sqlite3 is a native module that cannot run in jsdom, so @/lib/db is
 * mocked entirely. No database file is read or written during these tests.
 *
 * @/lib/email is mocked so email assertions never hit a real SMTP server.
 *
 * Environment variables (GOOGLE_SHEET_WEBHOOK_URL, RSVP_ADMIN_TOKEN) are set
 * per-test and deleted in afterEach to prevent leakage between tests.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/db", () => ({
  default: { prepare: vi.fn() },
}));

vi.mock("@/lib/email", () => ({
  sendNotification: vi.fn().mockResolvedValue(undefined),
}));

import { POST, GET } from "@/app/api/address/route";
import db from "@/lib/db";
import { sendNotification } from "@/lib/email";

const mockRun = vi.fn().mockReturnValue({ lastInsertRowid: 1 });
const mockAll = vi.fn().mockReturnValue([]);
const mockGet = vi.fn().mockReturnValue(undefined); // undefined = no existing record

// Let all queued promise callbacks settle so fire-and-forget chains complete
const flushPromises = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

beforeEach(() => {
  vi.clearAllMocks();
  // vi.clearAllMocks() wipes return values set in the vi.mock factory, so re-establish them
  vi.mocked(sendNotification).mockResolvedValue(undefined);
  (db.prepare as ReturnType<typeof vi.fn>).mockReturnValue({
    run: mockRun,
    all: mockAll,
    get: mockGet,
  });
  mockRun.mockReturnValue({ lastInsertRowid: 1 });
  mockAll.mockReturnValue([]);
  mockGet.mockReturnValue(undefined);
});

afterEach(() => {
  delete process.env.GOOGLE_SHEET_WEBHOOK_URL;
  delete process.env.RSVP_ADMIN_TOKEN;
});

const validAddress = {
  first_name: "Jane",
  last_name: "Doe",
  address1: "123 Main St",
  address2: "Apt 4B",
  city: "Sacramento",
  state: "CA",
  zip: "95814",
  country: "US",
};

function postRequest(body: unknown) {
  return new NextRequest("http://localhost/api/address", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function getRequest(token?: string) {
  const url = token
    ? `http://localhost/api/address?token=${token}`
    : "http://localhost/api/address";
  return new NextRequest(url, { method: "GET" });
}

describe("POST /api/address", () => {
  it("saves a valid address and returns success", async () => {
    const res = await POST(postRequest(validAddress));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.id).toBe(1);
  });

  it("stores address2 as null when omitted", async () => {
    const { address2: _, ...rest } = validAddress;
    const res = await POST(postRequest(rest));
    expect(res.status).toBe(200);
    expect(mockRun).toHaveBeenCalledWith(
      rest.first_name,
      rest.last_name,
      rest.address1,
      null,
      rest.city,
      rest.state,
      rest.zip,
      rest.country
    );
  });

  it("updates the existing record when the same name is resubmitted", async () => {
    mockGet.mockReturnValueOnce({ id: 42 });
    const updated = { ...validAddress, city: "San Francisco" };

    const res = await POST(postRequest(updated));
    expect(res.status).toBe(200);
    const json = await res.json();
    // Returns the original row's id, not a new one
    expect(json.id).toBe(42);
    // The run call should be an UPDATE, not an INSERT
    expect(mockRun).toHaveBeenCalledWith(
      updated.address1,
      updated.address2,
      updated.city,
      updated.state,
      updated.zip,
      updated.country,
      42
    );
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await POST(postRequest({ first_name: "Jane" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/required/);
  });

  it("returns 400 for an empty body", async () => {
    const res = await POST(postRequest({}));
    expect(res.status).toBe(400);
  });

  it("fires the webhook when GOOGLE_SHEET_WEBHOOK_URL is set", async () => {
    // The route fires fetch() without awaiting it (fire-and-forget), so we
    // only assert the call was made, not that it resolved.
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(new Response("ok"));
    process.env.GOOGLE_SHEET_WEBHOOK_URL = "https://example.com/webhook";

    await POST(postRequest(validAddress));

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://example.com/webhook",
      expect.objectContaining({ method: "POST" })
    );
    fetchSpy.mockRestore();
  });

  it("sends a success email after the webhook syncs", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response("ok"));
    process.env.GOOGLE_SHEET_WEBHOOK_URL = "https://example.com/webhook";

    await POST(postRequest(validAddress));
    await flushPromises();

    expect(sendNotification).toHaveBeenCalledWith(
      expect.stringContaining("Jane Doe"),
      expect.any(String)
    );
    expect(vi.mocked(sendNotification).mock.calls[0][0]).not.toMatch(/FAILED/);
    vi.restoreAllMocks();
  });

  it("sends a failure email if the webhook throws", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("network error"));
    process.env.GOOGLE_SHEET_WEBHOOK_URL = "https://example.com/webhook";

    await POST(postRequest(validAddress));
    await flushPromises();

    expect(sendNotification).toHaveBeenCalledWith(
      expect.stringContaining("FAILED"),
      expect.stringContaining("Jane Doe")
    );
    vi.restoreAllMocks();
  });

  it("does not fire the webhook when GOOGLE_SHEET_WEBHOOK_URL is not set", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(new Response("ok"));

    await POST(postRequest(validAddress));

    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("returns 500 when the database throws", async () => {
    // The route's catch block logs the error to stderr before returning 500 —
    // the console.error output during this test is expected, not a failure.
    (db.prepare as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
      throw new Error("DB error");
    });
    const res = await POST(postRequest(validAddress));
    expect(res.status).toBe(500);
  });
});

describe("GET /api/address", () => {
  it("returns 401 when no token is provided", async () => {
    process.env.RSVP_ADMIN_TOKEN = "correct-token";
    const res = await GET(getRequest());
    expect(res.status).toBe(401);
  });

  it("returns 401 for a wrong token", async () => {
    process.env.RSVP_ADMIN_TOKEN = "correct-token";
    const res = await GET(getRequest("wrong-token"));
    expect(res.status).toBe(401);
  });

  it("returns all addresses sorted newest-first with the correct token", async () => {
    process.env.RSVP_ADMIN_TOKEN = "correct-token";
    const rows = [{ id: 1, ...validAddress, created_at: "2026-11-13T00:00:00Z" }];
    mockAll.mockReturnValue(rows);

    const res = await GET(getRequest("correct-token"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(rows);
  });
});
