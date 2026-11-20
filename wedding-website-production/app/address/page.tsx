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
      <main className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--bg)" }}>
        <div className="w-full max-w-md p-8 flex flex-col gap-4 text-center" style={{ border: "2.5px solid var(--black)", background: "var(--cream)" }}>
          <h1 className="text-xs uppercase tracking-[0.5em]" style={{ color: "#444" }}>Thank you</h1>
          <p className="text-lg">We have your address — your invitation will be on its way soon.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--bg)" }}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8"
        style={{ border: "2.5px solid var(--black)", background: "var(--cream)" }}
      >
        <h1 className="text-xs uppercase tracking-[0.5em]" style={{ color: "#444" }}>Your Mailing Address</h1>
        <p className="text-sm" style={{ color: "#666" }}>
          Share your address so we can mail your wedding invitation.
        </p>

        <div className="flex gap-3">
          <label className="flex-1">
            <span>First name</span>
            <input required value={form.first_name} onChange={(e) => set("first_name", e.target.value)} />
          </label>
          <label className="flex-1">
            <span>Last name</span>
            <input required value={form.last_name} onChange={(e) => set("last_name", e.target.value)} />
          </label>
        </div>

        <label>
          <span>Address line 1</span>
          <input required value={form.address1} onChange={(e) => set("address1", e.target.value)} />
        </label>

        <label>
          <span>Address line 2 (optional)</span>
          <input value={form.address2} onChange={(e) => set("address2", e.target.value)} />
        </label>

        <div className="flex gap-3">
          <label className="flex-1">
            <span>City</span>
            <input required value={form.city} onChange={(e) => set("city", e.target.value)} />
          </label>
          <label className="w-24">
            <span>State / Province</span>
            <input required value={form.state} onChange={(e) => set("state", e.target.value)} />
          </label>
        </div>

        <div className="flex gap-3">
          <label className="w-32">
            <span>ZIP / Postal code</span>
            <input required value={form.zip} onChange={(e) => set("zip", e.target.value)} />
          </label>
          <label className="flex-1">
            <span>Country</span>
            <input required value={form.country} onChange={(e) => set("country", e.target.value)} />
          </label>
        </div>

        <button
          type="submit"
          disabled={status === "saving"}
          className="btn-sketch font-bold uppercase tracking-[0.2em] py-2.5 text-white"
          style={{
            background: status === "saving" ? "#ccc" : "#ED2232",
            cursor: status === "saving" ? "default" : "pointer",
          }}
        >
          {status === "saving" ? "Saving..." : "Submit Address"}
        </button>

        {status === "error" && (
          <p className="text-sm text-center" style={{ color: "var(--pink)" }}>
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </main>
  );
}
