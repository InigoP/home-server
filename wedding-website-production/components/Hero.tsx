import FlipLink from "@/components/FlipLink";

export default function Hero() {
  return (
    <section
      className="relative flex min-h-[85vh] flex-col items-center justify-center px-6 text-center overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      <div className="sprocket-strip absolute top-0 left-0 right-0" />

      <div>
        <p
          className="mb-6 text-[0.65rem] uppercase tracking-[0.4em] opacity-50"
          style={{ fontFamily: "var(--font-se)" }}
        >
          — now showing —
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div
            className="inline-block"
            style={{ background: "var(--pink)", padding: "0.05rem 0.75rem 0.05rem 0" }}
          >
            <span
              className="block font-display leading-none"
              style={{ fontSize: "clamp(2.5rem, 8vw, 4.5rem)", color: "var(--cream)" }}
            >
              Sonia
            </span>
          </div>
          <span
            className="font-display"
            style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", color: "var(--orange)" }}
          >
            &amp;
          </span>
          <div
            className="inline-block"
            style={{ background: "var(--yellow)", padding: "0.05rem 0.75rem 0.05rem 0" }}
          >
            <span
              className="block font-display leading-none"
              style={{ fontSize: "clamp(2.5rem, 8vw, 4.5rem)", color: "var(--black)" }}
            >
              Inigo
            </span>
          </div>
        </div>

        <div
          className="relative inline-block px-6 py-4"
          style={{ border: "2.5px solid var(--black)" }}
        >
          <span
            className="absolute text-[0.6rem] uppercase tracking-[0.12em] px-2"
            style={{
              top: "-0.6rem",
              left: "0.75rem",
              background: "var(--bg)",
              fontFamily: "var(--font-se)",
              color: "var(--pink)",
            }}
          >
            ★ Wedding ★
          </span>
          <p className="font-display text-xl mb-1">June 7, 2026</p>
          <p style={{ fontFamily: "var(--font-se)", fontSize: "0.85rem", lineHeight: 1.55 }}>
            Pavillon de la Jamaïque
          </p>
          <p style={{ fontFamily: "var(--font-se)", fontSize: "0.75rem", color: "#777", marginTop: "0.2rem" }}>
            Montréal, Québec
          </p>
        </div>

        <div className="mt-8">
          <FlipLink
            href="/rsvp"
            className="inline-block font-display text-sm uppercase tracking-[0.08em] px-10 py-3 text-white transition-transform hover:-translate-y-0.5"
            style={{
              background: "var(--pink)",
              border: "2.5px solid var(--black)",
              boxShadow: "4px 4px 0 var(--black)",
            }}
          >
            RSVP
          </FlipLink>
        </div>
      </div>

      <div className="sprocket-strip absolute bottom-0 left-0 right-0" />
    </section>
  );
}
