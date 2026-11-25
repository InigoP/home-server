"use client";

import { useState } from "react";
import SceneNav from "@/components/SceneNav";

type PartyMember = { firstName: string; lastName: string };
type PartyForm = { wedding: string; welcome_party: string; dietary: string };

export default function RsvpPage() {
  const [step, setStep] = useState<"lookup" | "form">("lookup");
  const [looking, setLooking] = useState(false);
  const [party, setParty] = useState<PartyMember[]>([]);
  const [hasExisting, setHasExisting] = useState(false);

  const [name, setName] = useState({ first: "", last: "" });
  const [form, setForm] = useState({ wedding: "yes", welcome_party: "yes", dietary: "" });
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
      setHasExisting(!!data.existingRsvp);

      if (data.existingRsvp) {
        setForm({
          wedding: data.existingRsvp.wedding ?? "yes",
          welcome_party: data.existingRsvp.welcome_party ?? "yes",
          dietary: data.existingRsvp.dietary ?? "",
        });
      }

      setPartyForms(members.map((_, i) => {
        const existing = data.partyExistingRsvps?.[i];
        return {
          wedding: existing?.wedding ?? "yes",
          welcome_party: existing?.welcome_party ?? "yes",
          dietary: existing?.dietary ?? "",
        };
      }));
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

  const fieldStyle: React.CSSProperties = {
    border: "2px solid var(--black)",
    background: "#fff",
    fontFamily: "var(--font-se)",
    fontSize: "1.01rem",
    color: "var(--black)",
    padding: "0.6rem 0.75rem",
    width: "100%",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-se)",
    fontSize: "0.81rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    opacity: 0.6,
  };

  return (
    <main className="flex-1">
      <section className="w-full">
        <div className="sprocket-strip" />

        <div
          className="flex items-start justify-center p-8 pt-16"
          style={{ background: "#359c90", minHeight: "var(--hero-height)" }}
        >
        <div className="w-full max-w-md">
          <div className="relative mx-2" style={{ transform: "rotate(-0.75deg)", zIndex: 1000 }}>
            {/* Yellow tape */}
            <div
              className="absolute z-10"
              style={{
                top: "-11px", left: "14%",
                width: "52px", height: "17px",
                background: "rgb(255, 228, 40)",
                border: "1px solid rgba(0,0,0,0.1)",
                transform: "rotate(-2.5deg)",
              }}
            />
            <div
              className="absolute z-10"
              style={{
                top: "-11px", right: "14%",
                width: "52px", height: "17px",
                background: "rgb(255, 228, 40)",
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
                <h1 className="font-display" style={{ fontSize: "1.46rem", color: "var(--black)" }}>
                  RSVP
                </h1>
                <span style={{ ...labelStyle, opacity: 0.45 }}>reply card</span>
              </div>

              <div className="p-8">
                {status === "done" ? (
                  <div className="text-center py-4">
                    <strong
                      className="block font-display mb-3"
                      style={{ fontSize: "clamp(1.97rem, 6.75vw, 2.81rem)", color: "var(--black)" }}
                    >
                      Hope to see you there!
                    </strong>
                    <p className="mb-4" style={{ fontFamily: "var(--font-se)", fontSize: "1.07rem" }}>
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
                        fontSize: "0.875rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      RSVP received ★
                    </span>
                  </div>
                ) : step === "lookup" ? (
                  <form onSubmit={handleLookup} className="flex flex-col gap-4">
                    <p className="opacity-60" style={{ fontFamily: "var(--font-se)", fontSize: "0.98rem" }}>
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
                      className="btn-sketch py-3 font-display uppercase tracking-[0.04em] text-white"
                      style={{
                        fontSize: "1.09375rem",
                        background: looking ? "#ccc" : "var(--pink)",
                        cursor: looking ? "default" : "pointer",
                      }}
                    >
                      {looking ? "Looking up..." : "Find My Invitation →"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex items-baseline justify-between">
                      <span className="font-display" style={{ fontSize: "1.24rem" }}>
                        {name.first} {name.last}
                      </span>
                      <button
                        type="button"
                        onClick={() => setStep("lookup")}
                        style={{
                          fontFamily: "var(--font-se)",
                          fontSize: "0.81rem",
                          letterSpacing: "0.08em",
                          textDecoration: "underline",
                          opacity: 0.5,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        back
                      </button>
                    </div>

                    {hasExisting && (
                      <p style={{ fontFamily: "var(--font-se)", fontSize: "0.875rem", opacity: 0.55 }}>
                        Update and resubmit to make changes!
                      </p>
                    )}

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

                    {party.map((member, i) => (
                      <div key={i}>
                        <div style={{ borderTop: "2px solid var(--black)", margin: "0.25rem 0" }} />
                        <div className="flex flex-col gap-4 mt-4">
                          <span className="font-display" style={{ fontSize: "1.125rem" }}>
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
                      className="btn-sketch mt-1 py-3 font-display uppercase tracking-[0.04em] text-white"
                      style={{
                        fontSize: "0.98rem",
                        background: status === "saving" ? "#ccc" : "var(--pink)",
                        cursor: status === "saving" ? "default" : "pointer",
                      }}
                    >
                      {status === "saving" ? "Sending..." : hasExisting ? "Update RSVP →" : "Submit RSVP →"}
                    </button>

                    {status === "error" && (
                      <p
                        className="text-center"
                        style={{ fontFamily: "var(--font-se)", fontSize: "0.98rem", color: "var(--pink)" }}
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

        <div className="sprocket-strip" />
      </section>
      <SceneNav prev={{ href: "/faq", label: "FAQ" }} />
    </main>
  );
}
