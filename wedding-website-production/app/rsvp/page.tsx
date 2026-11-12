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

  const fieldStyle = {
    border: "2px solid var(--black)",
    background: "#fff",
    fontFamily: "var(--font-se)",
    fontSize: "0.9rem",
    color: "var(--black)",
    padding: "0.6rem 0.75rem",
    width: "100%",
  };

  const labelStyle = {
    fontFamily: "var(--font-se)",
    fontSize: "0.72rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    opacity: 0.6,
  };

  return (
    <main
      className="min-h-screen flex items-start justify-center p-8 pt-16"
      style={{ background: "var(--bg)" }}
    >
      <div className="w-full max-w-md">
        {/* Reply card placard */}
        <div className="relative mx-2" style={{ transform: "rotate(-0.75deg)" }}>
          {/* Yellow tape */}
          <div
            className="absolute z-10"
            style={{
              top: "-11px",
              left: "14%",
              width: "52px",
              height: "17px",
              background: "rgba(255, 228, 40, 0.75)",
              border: "1px solid rgba(0,0,0,0.1)",
              transform: "rotate(-2.5deg)",
            }}
          />
          <div
            className="absolute z-10"
            style={{
              top: "-11px",
              right: "14%",
              width: "52px",
              height: "17px",
              background: "rgba(255, 228, 40, 0.75)",
              border: "1px solid rgba(0,0,0,0.1)",
              transform: "rotate(2.5deg)",
            }}
          />

          <div
            style={{
              border: "2.5px solid var(--black)",
              boxShadow: "5px 5px 0 var(--black)",
              background: "var(--cream)",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "var(--yellow)",
                borderBottom: "2.5px solid var(--black)",
                padding: "0.65rem 1.5rem",
                display: "flex",
                alignItems: "baseline",
                gap: "0.75rem",
              }}
            >
              <h1 className="font-display" style={{ fontSize: "1.3rem", color: "var(--black)" }}>
                RSVP
              </h1>
              <span style={{ ...labelStyle, opacity: 0.45 }}>reply card</span>
            </div>

            <div className="p-8 flex flex-col gap-5">
              {status !== "done" ? (
                <>
                  <p className="text-sm opacity-60" style={{ fontFamily: "var(--font-se)" }}>
                    Please RSVP by April 1, 2026.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label className="flex flex-col gap-1">
                      <span style={labelStyle}>Name</span>
                      <input
                        required
                        style={fieldStyle}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </label>

                    <label className="flex flex-col gap-1">
                      <span style={labelStyle}>Email</span>
                      <input
                        type="email"
                        style={fieldStyle}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </label>

                    <label className="flex flex-col gap-1">
                      <span style={labelStyle}>Attending the wedding?</span>
                      <select
                        style={fieldStyle}
                        value={form.attending}
                        onChange={(e) => setForm({ ...form, attending: e.target.value })}
                      >
                        <option value="yes">Yes, I'll be there</option>
                        <option value="no">Sorry, can't make it</option>
                      </select>
                    </label>

                    <label className="flex flex-col gap-1">
                      <span style={labelStyle}>Attending welcome party?</span>
                      <select
                        style={fieldStyle}
                        value={form.welcome_party}
                        onChange={(e) => setForm({ ...form, welcome_party: e.target.value })}
                      >
                        <option value="yes">Yes, see you Saturday</option>
                        <option value="no">Just the main event</option>
                      </select>
                    </label>

                    <label className="flex flex-col gap-1">
                      <span style={labelStyle}>Dietary restrictions</span>
                      <input
                        style={fieldStyle}
                        value={form.dietary}
                        onChange={(e) => setForm({ ...form, dietary: e.target.value })}
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={status === "saving"}
                      className="mt-1 py-3 font-display text-sm uppercase tracking-[0.04em] text-white transition-transform hover:translate-x-[2px] hover:translate-y-[2px]"
                      style={{
                        background: status === "saving" ? "#ccc" : "var(--pink)",
                        border: "2.5px solid var(--black)",
                        boxShadow: status === "saving" ? "none" : "4px 4px 0 var(--black)",
                        cursor: status === "saving" ? "default" : "pointer",
                      }}
                    >
                      {status === "saving" ? "Sending..." : "Submit RSVP →"}
                    </button>

                    {status === "error" && (
                      <p
                        className="text-sm text-center"
                        style={{ fontFamily: "var(--font-se)", color: "var(--pink)" }}
                      >
                        Something went wrong — please try again.
                      </p>
                    )}
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <strong
                    className="block font-display mb-3"
                    style={{ fontSize: "clamp(1.75rem, 6vw, 2.5rem)", color: "var(--black)" }}
                  >
                    See You There!
                  </strong>
                  <span
                    className="inline-block"
                    style={{
                      background: "var(--yellow)",
                      padding: "0.3rem 0.8rem",
                      border: "2px solid var(--black)",
                      boxShadow: "2px 2px 0 var(--black)",
                      fontFamily: "var(--font-se)",
                      fontSize: "0.78rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    RSVP received ★
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
