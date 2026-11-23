import SceneNav from "@/components/SceneNav";

const scriptBody: React.CSSProperties = {
  fontFamily: "var(--font-se), 'Courier Prime', monospace",
  fontSize: "0.95rem",
  lineHeight: 1.7,
  color: "var(--black)",
};

const slug: React.CSSProperties = {
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  fontWeight: 700,
  marginBottom: "1.25rem",
};

const action: React.CSSProperties = {
  marginBottom: "1.5rem",
  maxWidth: "52ch",
};

const cue: React.CSSProperties = {
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  textAlign: "center",
  marginBottom: "0.1rem",
  marginTop: "1.25rem",
  paddingLeft: "6rem",
  paddingRight: "0",
};

const paren: React.CSSProperties = {
  textAlign: "center",
  fontStyle: "italic",
  opacity: 0.65,
  fontSize: "0.85rem",
  marginBottom: "0.1rem",
  paddingLeft: "6rem",
  paddingRight: "0",
};

const dialogue: React.CSSProperties = {
  maxWidth: "38ch",
  margin: "0 auto 1.5rem",
  textAlign: "left",
};

const transition: React.CSSProperties = {
  textAlign: "right",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginTop: "2.5rem",
};

const noteKey: React.CSSProperties = {
  textTransform: "uppercase",
  letterSpacing: "0.15em",
  fontSize: "0.72rem",
  opacity: 0.55,
  alignSelf: "baseline",
};

export default function WelcomeParty() {
  return (
    <main className="flex-1">
      <div className="sprocket-strip" />

      <div style={{ background: "#F2EDDE", paddingTop: "3.5rem", paddingBottom: "5rem" }}>
        {/* Title card — screenplay cover feel */}
        <div className="max-w-2xl mx-auto px-6 text-center mb-14">
          <p
            style={{
              fontFamily: "var(--font-se)",
              fontSize: "0.65rem",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              opacity: 0.5,
            }}
          >
            A Wedding Weekend
          </p>
          <p
            className="font-display"
            style={{
              fontSize: "clamp(1.4rem, 4vw, 2rem)",
              letterSpacing: "0.25em",
              marginTop: "0.9rem",
            }}
          >
            SCENE 01
          </p>
          <p
            className="font-display"
            style={{
              fontSize: "clamp(2.25rem, 6vw, 3.25rem)",
              letterSpacing: "0.1em",
              marginTop: "0.25rem",
              fontStyle: "italic",
            }}
          >
            &ldquo;The Welcome Party&rdquo;
          </p>
          <p
            style={{
              fontFamily: "var(--font-se)",
              fontSize: "0.7rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              opacity: 0.45,
              marginTop: "1.5rem",
            }}
          >
            Written by Sonia · Directed by Inigo
          </p>
        </div>

        {/* Script page */}
        <article
          className="relative mx-auto"
          style={{
            maxWidth: "720px",
            background: "#FDF9EC",
            border: "2px solid var(--black)",
            padding: "4rem 3.75rem 3.5rem",
            ...scriptBody,
          }}
        >
          {/* "Typed" page number */}
          <span
            style={{
              position: "absolute",
              top: "1rem",
              right: "1.25rem",
              fontFamily: "var(--font-se)",
              fontSize: "0.7rem",
              opacity: 0.45,
              letterSpacing: "0.08em",
            }}
          >
            1.
          </span>

          <p style={{ ...slug, marginTop: "2.5rem" }}>Cut to:</p>

          {/* Production notes block — faux script insert */}
          <div
            style={{
              borderTop: "1.5px dashed rgba(26,21,16,0.35)",
              borderBottom: "1.5px dashed rgba(26,21,16,0.35)",
              padding: "1.5rem 0",
              margin: "1.5rem 0",
            }}
          >
            <p
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.3em",
                fontSize: "0.7rem",
                opacity: 0.55,
                marginBottom: "1.25rem",
                textAlign: "center",
              }}
            >
              — Production Notes —
            </p>
            <dl
              style={{
                display: "grid",
                gridTemplateColumns: "max-content 1fr",
                gap: "0.6rem 1.5rem",
                margin: 0,
              }}
            >
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

          <p style={transition}>Fade out.</p>
          <p
            style={{
              ...transition,
              fontSize: "0.75rem",
              opacity: 0.6,
              marginTop: "0.25rem",
            }}
          >
            To be continued in Scene 02 — The Ceremony
          </p>
        </article>

        {/* End slate */}
        <p
          className="max-w-2xl mx-auto px-6 text-center"
          style={{
            fontFamily: "var(--font-se)",
            fontSize: "0.65rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            opacity: 0.4,
            marginTop: "3rem",
          }}
        >
          — End of Scene 01 —
        </p>
      </div>

      <div className="sprocket-strip" />

      <SceneNav
        prev={{ href: "/schedule", label: "Schedule" }}
        next={{ href: "/schedule/ceremony", label: "Ceremony" }}
      />
    </main>
  );
}
