"use client";

import { useEffect, useRef, useState } from "react";
import Events from "@/components/Events";

const scriptBody: React.CSSProperties = {
  fontFamily: "var(--font-se), 'Courier Prime', monospace",
  fontSize: "0.95rem",
  lineHeight: 1.7,
  color: "var(--black)",
};

const noteKey: React.CSSProperties = {
  textTransform: "uppercase",
  letterSpacing: "0.15em",
  fontSize: "0.72rem",
  opacity: 0.55,
  alignSelf: "baseline",
};

const scriptTransition: React.CSSProperties = {
  textAlign: "right",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginTop: "2.5rem",
};

const paperBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.11 0 0 0 0 0.08 0 0 0 0 0.05 0 0 0 0.08 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"), #FDF9EC`;

const scribble: React.CSSProperties = {
  position: "absolute",
  fontFamily: "var(--font-hw), cursive",
  fontSize: "1.35rem",
  lineHeight: 1.1,
  color: "#C85A70",
  pointerEvents: "none",
  whiteSpace: "nowrap",
};

const closeBtn: React.CSSProperties = {
  background: "none",
  border: "1.5px solid var(--black)",
  cursor: "pointer",
  fontFamily: "var(--font-se), 'Courier Prime', monospace",
  fontSize: "0.65rem",
  letterSpacing: "0.3em",
  textTransform: "uppercase",
  color: "var(--black)",
  padding: "0.3rem 0.75rem",
};

function WelcomeParty({
  sectionRef,
  onClose,
  onContinue,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
  onContinue: () => void;
}) {
  return (
    <section
      ref={sectionRef}
      id="welcome-party"
      className="animate-fade-up"
      style={{ background: "#F2EDDE", paddingTop: "3.5rem", paddingBottom: "5rem" }}
    >
      <div className="max-w-2xl mx-auto px-6 flex justify-end mb-2">
        <button onClick={onClose} style={closeBtn}>✕ close</button>
      </div>

      <div className="max-w-2xl mx-auto px-6 text-center mb-14">
        <p style={{ fontFamily: "var(--font-se)", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", opacity: 0.5 }}>
          A Wedding Weekend
        </p>
        <p className="font-display" style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", letterSpacing: "0.25em", marginTop: "0.9rem" }}>
          ACT 01
        </p>
        <p className="font-display" style={{ fontSize: "clamp(2.25rem, 6vw, 3.25rem)", letterSpacing: "0.1em", marginTop: "0.25rem", fontStyle: "italic" }}>
          &ldquo;The Welcome Party&rdquo;
        </p>
        <p style={{ fontFamily: "var(--font-se)", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.45, marginTop: "1.5rem" }}>
          Written by Sonia · Directed by Inigo
        </p>
      </div>

      <article
        className="relative mx-auto px-6"
        style={{ maxWidth: "720px", background: paperBg, border: "2px solid var(--black)", padding: "4rem 3.75rem 3.5rem", ...scriptBody }}
      >
        <span style={{ position: "absolute", top: "1rem", right: "1.25rem", fontFamily: "var(--font-se)", fontSize: "0.7rem", opacity: 0.45, letterSpacing: "0.08em" }}>
          1.
        </span>

        <span style={{ ...scribble, top: "3.1rem", left: "0.9rem", transform: "rotate(-6deg)" }}>
          sneakers ok!
        </span>
        <span style={{ ...scribble, bottom: "7.5rem", right: "1.1rem", transform: "rotate(4deg)", fontSize: "1.2rem" }}>
          let's get the party started!
        </span>

        <p style={{ textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 700, marginBottom: "1.25rem", marginTop: "2.5rem" }}>
          Cut to:
        </p>
        <div style={{ borderTop: "1.5px dashed rgba(26,21,16,0.35)", borderBottom: "1.5px dashed rgba(26,21,16,0.35)", padding: "1.5rem 0", margin: "1.5rem 0" }}>
          <p style={{ textTransform: "uppercase", letterSpacing: "0.3em", fontSize: "0.7rem", opacity: 0.55, marginBottom: "1.25rem", textAlign: "center" }}>
            — Production Notes —
          </p>
          <dl style={{ display: "grid", gridTemplateColumns: "max-content 1fr", gap: "0.6rem 1.5rem", margin: 0 }}>
            <dt style={noteKey}>Call time</dt>
            <dd>Sunday, June 6, 2026 · 7:00 PM</dd>
            <dt style={noteKey}>Location</dt>
            <dd>TBD — Downtown Montréal</dd>
            <dt style={noteKey}>Wardrobe</dt>
            <dd>Casual — come as you are</dd>
            <dt style={noteKey}>Craft svcs</dt>
            <dd>Light bites &amp; drinks on the house</dd>
            <dt style={noteKey}>Director&apos;s note</dt>
            <dd>Drop in when you can. Leave when you&apos;re ready.</dd>
          </dl>
        </div>
        <p style={scriptTransition}>Fade out.</p>
        <button
          onClick={onContinue}
          style={{
            ...scriptTransition,
            fontSize: "0.8rem",
            marginTop: "0.25rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-se), 'Courier Prime', monospace",
            color: "var(--black)",
            display: "block",
            width: "100%",
            textAlign: "right",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            fontWeight: 600,
          }}
        >
          To be continued in Act 02 — The Ceremony →
        </button>
      </article>

      <div className="relative mx-auto px-6 mt-8" style={{ maxWidth: "720px" }}>
        <p style={{ fontFamily: "var(--font-se)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.5, marginBottom: "0.6rem" }}>
          — Location (TBD) —
        </p>
        <iframe
          src="https://maps.google.com/maps?q=Downtown+Montreal,+Quebec&output=embed"
          width="100%"
          height="280"
          style={{ border: "2px solid var(--black)", display: "block" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <p className="max-w-2xl mx-auto px-6 text-center" style={{ fontFamily: "var(--font-se)", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", opacity: 0.4, marginTop: "3rem" }}>
        — End of Act 01 —
      </p>
    </section>
  );
}

function Ceremony({
  sectionRef,
  onClose,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
}) {
  return (
    <section
      ref={sectionRef}
      id="ceremony"
      className="animate-fade-up"
      style={{ background: "#F2EDDE", paddingTop: "3.5rem", paddingBottom: "5rem" }}
    >
      <div className="max-w-2xl mx-auto px-6 flex justify-end mb-2">
        <button onClick={onClose} style={closeBtn}>✕ close</button>
      </div>

      <div className="max-w-2xl mx-auto px-6 text-center mb-14">
        <p style={{ fontFamily: "var(--font-se)", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", opacity: 0.5 }}>
          A Wedding Weekend
        </p>
        <p className="font-display" style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", letterSpacing: "0.25em", marginTop: "0.9rem" }}>
          ACT 02
        </p>
        <p className="font-display" style={{ fontSize: "clamp(2.25rem, 6vw, 3.25rem)", letterSpacing: "0.1em", marginTop: "0.25rem", fontStyle: "italic" }}>
          &ldquo;The Ceremony &amp; Reception&rdquo;
        </p>
        <p style={{ fontFamily: "var(--font-se)", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.45, marginTop: "1.5rem" }}>
          Written by Sonia · Directed by Inigo
        </p>
      </div>

      <article
        className="relative mx-auto px-6"
        style={{ maxWidth: "720px", background: paperBg, border: "2px solid var(--black)", padding: "4rem 3.75rem 3.5rem", ...scriptBody }}
      >
        <span style={{ position: "absolute", top: "1rem", right: "1.25rem", fontFamily: "var(--font-se)", fontSize: "0.7rem", opacity: 0.45, letterSpacing: "0.08em" }}>
          2.
        </span>

        {/* <span style={{ ...scribble, top: "1rem", left: "0.8rem", transform: "rotate(-5deg)" }}>
          arrive early — parking!!
        </span>
        <span style={{ ...scribble, bottom: "2rem", right: "0.9rem", transform: "rotate(5deg)", fontSize: "1.2rem" }}>
          dancing shoes 💃
        </span> */}

        <p style={{ textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 700, marginBottom: "1.25rem", marginTop: "2.5rem" }}>
          Cut to:
        </p>
        <div style={{ borderTop: "1.5px dashed rgba(26,21,16,0.35)", borderBottom: "1.5px dashed rgba(26,21,16,0.35)", padding: "1.5rem 0", margin: "1.5rem 0" }}>
          <p style={{ textTransform: "uppercase", letterSpacing: "0.3em", fontSize: "0.7rem", opacity: 0.55, marginBottom: "1.25rem", textAlign: "center" }}>
            — Production Notes —
          </p>
          <dl style={{ display: "grid", gridTemplateColumns: "max-content 1fr", gap: "0.6rem 1.5rem", margin: 0 }}>
            <dt style={noteKey}>Call time</dt>
            <dd>Monday, June 7, 2026 · 3:45 PM</dd>
            <dt style={noteKey}>Camera</dt>
            <dd>Pavillon de la Jamaïque, Parc Jean-Drapeau</dd>
            <dt style={noteKey}>Ceremony</dt>
            <dd>4:00 PM</dd>
            <dt style={noteKey}>Reception</dt>
            <dd>6:00 PM — dinner, dancing &amp; toasts</dd>
            <dt style={noteKey}>Wrap</dt>
            <dd>2:00 AM</dd>
            <dt style={noteKey}>Wardrobe</dt>
            <dd>Formal — black tie optional</dd>
          </dl>
        </div>
        <p style={scriptTransition}>Fade to black.</p>
        <p style={{ ...scriptTransition, fontSize: "0.75rem", opacity: 0.6, marginTop: "0.25rem" }}>
          The end.
        </p>
      </article>

      <div className="relative mx-auto px-6 mt-8" style={{ maxWidth: "720px" }}>
        <p style={{ fontFamily: "var(--font-se)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.5, marginBottom: "0.6rem" }}>
          — Location —
        </p>
        <iframe
          src="https://maps.google.com/maps?q=Pavillon+de+la+Jamaique,+Parc+Jean-Drapeau,+Montreal&output=embed"
          width="100%"
          height="280"
          style={{ border: "2px solid var(--black)", display: "block" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <p className="max-w-2xl mx-auto px-6 text-center" style={{ fontFamily: "var(--font-se)", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", opacity: 0.4, marginTop: "3rem" }}>
        — End of Act 02 —
      </p>
    </section>
  );
}

const VALID_HASHES = new Set(["#welcome-party", "#ceremony"]);

export default function EventsSection() {
  const [active, setActive] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Sync React state ← URL on mount and on browser back/forward
  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash;
      setActive(VALID_HASHES.has(hash) ? hash : null);
    };
    syncFromHash();
    window.addEventListener("popstate", syncFromHash);
    window.addEventListener("hashchange", syncFromHash);
    return () => {
      window.removeEventListener("popstate", syncFromHash);
      window.removeEventListener("hashchange", syncFromHash);
    };
  }, []);

  // Scroll into view when active changes
  useEffect(() => {
    if (active && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [active]);

  function openAct(href: string) {
    setActive(href);
    history.pushState(null, "", href);
  }

  function handleClose() {
    setActive(null);
    history.pushState(null, "", window.location.pathname);
    heroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <div
        ref={heroRef}
        className="flex flex-col justify-center pt-8 pb-24"
        style={{ background: "#359c90", minHeight: "var(--hero-height)" }}
      >
        <div className="max-w-4xl mx-auto px-6 mb-6">
          <p
            className="text-[0.65rem] uppercase tracking-[0.4em] opacity-60 mb-1"
            style={{ fontFamily: "var(--font-se)", color: "var(--black)" }}
          >
            Events
          </p>
          <h1 className="font-display text-3xl" style={{ color: "var(--black)" }}>
            Weekend of June 6–7
          </h1>
        </div>
        <Events onActClick={openAct} />
      </div>

      <div className="sprocket-strip" />

      {active === "#welcome-party" && (
        <WelcomeParty
          sectionRef={sectionRef}
          onClose={handleClose}
          onContinue={() => openAct("#ceremony")}
        />
      )}
      {active === "#ceremony" && (
        <Ceremony
          sectionRef={sectionRef}
          onClose={handleClose}
        />
      )}
    </>
  );
}
