import FlipLink from "@/components/FlipLink";

export default function Hero() {
  return (
    <section className="w-full">
      {/* Film section — full-bleed */}
      <div className="sprocket-strip" />

      <div
        className="relative flex flex-col items-center justify-center text-center px-6 py-16 w-full"
        style={{ background: "#359c90", minHeight: "var(--hero-height)" }}
      >
        <p
          className="animate-fade-up uppercase mb-5 opacity-50"
          style={{
            fontFamily: "var(--font-se)",
            fontSize: "0.94rem",
            letterSpacing: "0.3em",
            color: "var(--black)",
          }}
        >
          — now showing —
        </p>

        <div
          className="animate-fade-up flex flex-wrap items-center justify-center gap-3 mb-10"
          style={{ animationDelay: "0.08s" }}
        >
          <div
            className="inline-block"
            style={{
              background: "var(--pink)",
              padding: "0.05rem 0.6rem 0.05rem 0",
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            <span
              className="block font-display"
              style={{
                fontSize: "clamp(3.9rem, 13vw, 6.5rem)",
                letterSpacing: "0.1em",
                color: "var(--cream)",
                lineHeight: 0.9,
              }}
            >
              Sonia
            </span>
          </div>
          <span
            className="font-display"
            style={{
              fontSize: "clamp(2.6rem, 6.5vw, 3.58rem)",
              letterSpacing: "0.1em",
              color: "var(--black)",
              flexShrink: 0,
            }}
          >
            &amp;
          </span>
          <div
            className="inline-block"
            style={{
              background: "var(--blue-purple)",
              padding: "0.05rem 0.6rem 0.05rem 0",
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            <span
              className="block font-display"
              style={{
                fontSize: "clamp(3.9rem, 13vw, 6.5rem)",
                letterSpacing: "0.1em",
                color: "var(--cream)",
                lineHeight: 0.9,
              }}
            >
              Inigo
            </span>
          </div>
        </div>

        <div
          className="animate-fade-up relative inline-block"
          style={{
            border: "2.5px solid var(--black)",
            padding: "0.9rem 1.1rem",
            animationDelay: "0.16s",
          }}
        >
          <span
            className="absolute"
            style={{
              top: "-0.6rem",
              right: "-0.5rem",
              background: "var(--bg)",
              padding: "0 0.35rem",
              fontFamily: "var(--font-se)",
              fontSize: "0.85rem",
              letterSpacing: "0.12em",
              color: "var(--pink)",
              transform: "rotate(4deg)",
            }}
          >
            ★ WEDDING ★
          </span>
          <p
            className="font-display"
            style={{
              fontSize: "1.95rem",
              letterSpacing: "0.1em",
              marginBottom: "0.45rem",
            }}
          >
            June 7, 2027
          </p>
          <p
            style={{
              fontFamily: "var(--font-se)",
              fontSize: "1.01rem",
              letterSpacing: "0.15em",
              lineHeight: 1.55,
            }}
          >
            Pavillon de la Jamaïque
          </p>
          <p
            style={{
              fontFamily: "var(--font-se)",
              fontSize: "0.88rem",
              letterSpacing: "0.15em",
              marginTop: "0.2rem",
            }}
          >
            Montréal, Québec
          </p>
        </div>

        {/* RSVP button — inside teal panel, above bottom sprocket */}
        <div
          className="animate-fade-up mt-20"
          style={{ animationDelay: "0.24s", position: "relative", zIndex: 1000 }}
        >
          <FlipLink
            href="/rsvp"
            className="inline-block font-display uppercase tracking-[0.12em] px-14 py-5 text-white transition-transform hover:-translate-y-0.5"
            style={{
              fontSize: "1.65rem",
              background: "var(--orange)",
              border: "3px solid var(--black)",
              boxShadow: "6px 6px 0 var(--black)",
            }}
          >
            RSVP
          </FlipLink>
        </div>
      </div>

      <div className="sprocket-strip" />
    </section>
  );
}
