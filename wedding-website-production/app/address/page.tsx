"use client";

import { useState } from "react";

export default function AddressPage() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-md border-2 border-[#020202] bg-white p-8 flex flex-col gap-4 text-center">
          <h1 className="text-xs uppercase tracking-[0.5em] text-[#444]">Thank you</h1>
          <p className="text-lg">We have your address — your invitation will be on its way soon.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md border-2 border-[#020202] bg-white p-8 flex flex-col gap-4"
      >
        <h1 className="text-xs uppercase tracking-[0.5em] text-[#444]">Your Mailing Address</h1>
        <p className="text-sm text-[#444]">
          Share your address so we can mail your wedding invitation.
        </p>

        <div className="flex gap-3">
          <label className="flex flex-col gap-1 flex-1">
            <span className="text-sm text-[#444]">First name</span>
            <input
              required
              className="border-2 border-[#020202] bg-white px-3 py-2 text-[#020202] w-full"
              value={form.first_name}
              onChange={(e) => set("first_name", e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 flex-1">
            <span className="text-sm text-[#444]">Last name</span>
            <input
              required
              className="border-2 border-[#020202] bg-white px-3 py-2 text-[#020202] w-full"
              value={form.last_name}
              onChange={(e) => set("last_name", e.target.value)}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-[#444]">Address line 1</span>
          <input
            required
            className="border-2 border-[#020202] bg-white px-3 py-2 text-[#020202]"
            value={form.address1}
            onChange={(e) => set("address1", e.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-[#444]">Address line 2 (optional)</span>
          <input
            className="border-2 border-[#020202] bg-white px-3 py-2 text-[#020202]"
            value={form.address2}
            onChange={(e) => set("address2", e.target.value)}
          />
        </label>

        <div className="flex gap-3">
          <label className="flex flex-col gap-1 flex-1">
            <span className="text-sm text-[#444]">City</span>
            <input
              required
              className="border-2 border-[#020202] bg-white px-3 py-2 text-[#020202] w-full"
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 w-24">
            <span className="text-sm text-[#444]">State / Province</span>
            <input
              required
              className="border-2 border-[#020202] bg-white px-3 py-2 text-[#020202] w-full"
              value={form.state}
              onChange={(e) => set("state", e.target.value)}
            />
          </label>
        </div>

        <div className="flex gap-3">
          <label className="flex flex-col gap-1 w-32">
            <span className="text-sm text-[#444]">ZIP / Postal code</span>
            <input
              required
              className="border-2 border-[#020202] bg-white px-3 py-2 text-[#020202] w-full"
              value={form.zip}
              onChange={(e) => set("zip", e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 flex-1">
            <span className="text-sm text-[#444]">Country</span>
            <input
              required
              className="border-2 border-[#020202] bg-white px-3 py-2 text-[#020202] w-full"
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={status === "saving"}
          className="border-2 border-[#020202] bg-[#ED2232] text-white py-2.5 font-bold uppercase tracking-[0.2em] hover:bg-[#e01f7c] transition-colors"
        >
          {status === "saving" ? "Saving..." : "Submit Address"}
        </button>

        {status === "error" && (
          <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
        )}
      </form>
    </main>
  );
}
