"use client";

import { useState } from "react";
import SceneNav from "@/components/SceneNav";

type PartyMember = { firstName: string; lastName: string };
type PartyForm = { wedding: string; welcome_party: string; dietary: string };

export default function RsvpPage() {
  const [step, setStep] = useState<"lookup" | "form">("lookup");
  const [looking, setLooking] = useState(false);
  const [party, setParty] = useState<PartyMember[]>([]);

  const [name, setName] = useState({ first: "", last: "" });
  const [form, setForm] = useState({
    wedding: "yes",
    welcome_party: "yes",
    dietary: "",
  });
  const [partyForms, setPartyForms] = useState<PartyForm[]>([]);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setLooking(true);
    try {
      const res = await fetch(
        `/api/guest-lookup?first=${encodeURIComponent(name.first.trim())}&last=${encodeURIComponent(name.last.trim())}`
      );
      const data = await res.json();
      const members: PartyMember[] = data.party ?? [];
      setParty(members);
      setPartyForms(members.map(() => ({ wedding: "yes", welcome_party: "yes", dietary: "" })));
    } catch {
      setParty([]);
      setPartyForms([]);
    } finally {
      setLooking(false);
      setStep("form");
    }
  }

  function updatePartyForm(index: number, field: keyof PartyForm, value: string) {
    setPartyForms((prev) => prev.map((f, i) => i === index ? { ...f, [field]: value } : f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: name.first.trim(),
          last_name: name.last.trim(),
          wedding: form.wedding,
          welcome_party: form.welcome_party,
          dietary: form.dietary,
          party: party.map((member, i) => ({
            first_name: member.firstName,
            last_name: member.lastName,
            wedding: partyForms[i].wedding,
            welcome_party: partyForms[i].welcome_party,
            dietary: partyForms[i].dietary,
          })),
        }),
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
    <main className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="flex-1 flex items-start justify-center p-8 pt-16">
        <div className="w-full max-w-md">
          <div className="relative mx-2" style={{ transform: "rotate(-0.75deg)" }}>
            {/* Yellow tape */}
            <div
              className="absolute z-10"
              style={{
                top: "-11px", left: "14%",
                width: "52px", height: "17px",
                background: "rgba(255, 228, 40, 0.75)",
                border: "1px solid rgba(0,0,0,0.1)",
                transform: "rotate(-2.5deg)",
              }}
            />
            <div
              className="absolute z-10"
              style={{
                top: "-11px", right: "14%",
                width: "52px", height: "17px",
                background: "rgba(255, 228, 40, 0.75)",
                border: "1px solid rgba(0,0,0,0.1)",
                transform: "rotate(2.5deg)",
              }}
            />

            <div style={{ border: "2.5px solid var(--black)", boxShadow: "5px 5px 0 var(--black)", background: "var(--cream)" }}>
              <div
                style={{
                  background: "var(--blue-purple)",
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

              <div className="p-8">
                {status === "done" ? (
                  <div className="text-center py-4">
                    <strong
                      className="block font-display mb-3"
                      style={{ fontSize: "clamp(1.75rem, 6vw, 2.5rem)", color: "var(--black)" }}
                    >
                      Hope to see you there!
                    </strong>
                    <p
                      className="mb-4"
                      style={{ fontFamily: "var(--font-se)", fontSize: "0.95rem" }}
                    >
                      {[{ firstName: name.first, lastName: name.last }, ...party]
                        .map((m) => `${m.firstName} ${m.lastName}`)
                        .reduce<React.ReactNode[]>((acc, n, i, arr) => {
                          if (i === 0) return [n];
                          if (i === arr.length - 1) return [...acc, " & ", n];
                          return [...acc, ", ", n];
                        }, [])}
                    </p>
                    <span
                      className="inline-block"
                      style={{
                        background: "var(--blue-purple)",
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
                ) : step === "lookup" ? (
                  <form onSubmit={handleLookup} className="flex flex-col gap-4">
                    <p className="text-sm opacity-60" style={{ fontFamily: "var(--font-se)" }}>
                      Please RSVP by April 1, 2027.
                    </p>
                    <div className="flex gap-3">
                      <label className="flex flex-col gap-1 flex-1">
                        <span style={labelStyle}>First name</span>
                        <input
                          required
                          style={fieldStyle}
                          value={name.first}
                          onChange={(e) => setName({ ...name, first: e.target.value })}
                        />
                      </label>
                      <label className="flex flex-col gap-1 flex-1">
                        <span style={labelStyle}>Last name</span>
                        <input
                          required
                          style={fieldStyle}
                          value={name.last}
                          onChange={(e) => setName({ ...name, last: e.target.value })}
                        />
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={looking}
                      className="btn-sketch py-3 font-display text-sm uppercase tracking-[0.04em] text-white"
                      style={{
                        background: looking ? "#ccc" : "var(--pink)",
                        cursor: looking ? "default" : "pointer",
                      }}
                    >
                      {looking ? "Looking up..." : "Find My Invitation →"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Name + edit */}
                    <div className="flex items-baseline justify-between">
                      <span className="font-display" style={{ fontSize: "1.1rem" }}>
                        {name.first} {name.last}
                      </span>
                      <button
                        type="button"
                        onClick={() => setStep("lookup")}
                        style={{
                          fontFamily: "var(--font-se)",
                          fontSize: "0.72rem",
                          letterSpacing: "0.08em",
                          textDecoration: "underline",
                          opacity: 0.5,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        edit
                      </button>
                    </div>

                    <label className="flex flex-col gap-1">
                      <span style={labelStyle}>Attending welcome party?</span>
                      <select
                        style={fieldStyle}
                        value={form.welcome_party}
                        onChange={(e) => setForm({ ...form, welcome_party: e.target.value })}
                      >
                        <option value="yes">Yes, I'll be there</option>
                        <option value="no">Sorry, I can't make it</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1">
                      <span style={labelStyle}>Attending the wedding?</span>
                      <select
                        style={fieldStyle}
                        value={form.wedding}
                        onChange={(e) => setForm({ ...form, wedding: e.target.value })}
                      >
                        <option value="yes">Yes, I'll be there</option>
                        <option value="no">Sorry, I can't make it</option>
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

                    {/* Party members */}
                    {party.map((member, i) => (
                      <div key={i}>
                        <div style={{ borderTop: "2px solid var(--black)", margin: "0.25rem 0" }} />
                        <div className="flex flex-col gap-4 mt-4">
                          <span className="font-display" style={{ fontSize: "1rem" }}>
                            {member.firstName} {member.lastName}
                          </span>
                          <label className="flex flex-col gap-1">
                            <span style={labelStyle}>Attending welcome party?</span>
                            <select
                              style={fieldStyle}
                              value={partyForms[i].welcome_party}
                              onChange={(e) => updatePartyForm(i, "welcome_party", e.target.value)}
                            >
                              <option value="yes">Yes, I'll be there</option>
                              <option value="no">Sorry, I can't make it</option>
                            </select>
                          </label>
                          <label className="flex flex-col gap-1">
                            <span style={labelStyle}>Attending the wedding?</span>
                            <select
                              style={fieldStyle}
                              value={partyForms[i].wedding}
                              onChange={(e) => updatePartyForm(i, "wedding", e.target.value)}
                            >
                              <option value="yes">Yes, I'll be there</option>
                              <option value="no">Sorry, I can't make it</option>
                            </select>
                          </label>
                          <label className="flex flex-col gap-1">
                            <span style={labelStyle}>Dietary restrictions</span>
                            <input
                              style={fieldStyle}
                              value={partyForms[i].dietary}
                              onChange={(e) => updatePartyForm(i, "dietary", e.target.value)}
                            />
                          </label>
                        </div>
                      </div>
                    ))}

                    <button
                      type="submit"
                      disabled={status === "saving"}
                      className="btn-sketch mt-1 py-3 font-display text-sm uppercase tracking-[0.04em] text-white"
                      style={{
                        background: status === "saving" ? "#ccc" : "var(--pink)",
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SceneNav prev={{ href: "/faq", label: "FAQ" }} />
    </main>
  );
}
