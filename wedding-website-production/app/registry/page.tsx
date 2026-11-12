export default function Registry() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p
          className="text-[0.65rem] uppercase tracking-[0.4em] opacity-50 mb-1"
          style={{ fontFamily: "var(--font-se)" }}
        >
          Registry
        </p>
        <h1 className="font-display text-3xl">Gifts &amp; Wishes</h1>
      </div>

      <div
        style={{
          border: "2.5px solid var(--black)",
          boxShadow: "5px 5px 0 var(--black)",
          background: "var(--cream)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "var(--yellow)",
            borderBottom: "2.5px solid var(--black)",
            padding: "0.65rem 1.5rem",
          }}
        >
          <span className="font-display" style={{ fontSize: "1rem", color: "var(--black)" }}>
            Coming soon
          </span>
        </div>
        <div className="p-6">
          <p className="text-sm leading-relaxed opacity-60" style={{ fontFamily: "var(--font-se)" }}>
            Registry links will be shared with your invitation.
          </p>
        </div>
      </div>
    </main>
  );
}
