"use client";

import { useState } from "react";

export default function RsvpPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    attending: "yes",
    welcome_party: "yes",
    dietary: "",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/rsvp", {
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

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md border-2 border-[#020202] bg-white p-8 flex flex-col gap-4"
      >
        <h1 className="text-xs uppercase tracking-[0.5em] text-[#444]">RSVP</h1>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-[#444]">Name</span>
          <input
            required
            className="border-2 border-[#020202] bg-white px-3 py-2 text-[#020202]"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-[#444]">Email</span>
          <input
            type="email"
            className="border-2 border-[#020202] bg-white px-3 py-2 text-[#020202]"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-[#444]">Attending</span>
          <select
            className="border-2 border-[#020202] bg-white px-3 py-2 text-[#020202]"
            value={form.attending}
            onChange={(e) => setForm({ ...form, attending: e.target.value })}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-[#444]">Attending welcome party?</span>
          <select
            className="border-2 border-[#020202] bg-white px-3 py-2 text-[#020202]"
            value={form.welcome_party}
            onChange={(e) => setForm({ ...form, welcome_party: e.target.value })}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-[#444]">Dietary restrictions</span>
          <input
            className="border-2 border-[#020202] bg-white px-3 py-2 text-[#020202]"
            value={form.dietary}
            onChange={(e) => setForm({ ...form, dietary: e.target.value })}
          />
        </label>

        <button
          type="submit"
          disabled={status === "saving"}
          className="border-2 border-[#020202] bg-[#ED2232] text-white py-2.5 font-bold uppercase tracking-[0.2em] hover:bg-[#e01f7c] transition-colors"
        >
          {status === "saving" ? "Saving..." : "Submit RSVP"}
        </button>

        {status === "done" && <p className="text-green-600">Thanks! Your RSVP is saved.</p>}
        {status === "error" && <p className="text-red-600">Something went wrong. Please try again.</p>}
      </form>
    </main>
  );
}
