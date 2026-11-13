export default function ComingSoon() {
  return (
    <main
      className="relative flex min-h-screen flex-1 flex-col items-center justify-center overflow-hidden px-6 py-20 text-center"
      style={{ background: "var(--bg)" }}
    >
      <div className="sprocket-strip absolute top-0 left-0 right-0" />

      <p
        className="mb-6 text-[0.65rem] uppercase tracking-[0.4em] opacity-50"
        style={{ fontFamily: "var(--font-se)" }}
      >
        — coming soon —
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
          ★ Save the date ★
        </span>
        <p className="font-display text-xl mb-1">June 7, 2026</p>
        <p style={{ fontFamily: "var(--font-se)", fontSize: "0.85rem", lineHeight: 1.55 }}>
          Pavillon de la Jamaïque
        </p>
        <p
          style={{
            fontFamily: "var(--font-se)",
            fontSize: "0.75rem",
            color: "#777",
            marginTop: "0.2rem",
          }}
        >
          Montréal, Québec
        </p>
      </div>

      <p
        className="mt-8 max-w-md text-sm leading-relaxed opacity-70"
        style={{ fontFamily: "var(--font-se)" }}
      >
        We&apos;re putting the finishing touches on our wedding website. Check back
        soon for the schedule, travel details, and RSVP.
      </p>

      <div className="sprocket-strip absolute bottom-0 left-0 right-0" />
    </main>
  );
}
