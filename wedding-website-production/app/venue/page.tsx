export default function Venue() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p
          className="text-[0.65rem] uppercase tracking-[0.4em] opacity-50 mb-1"
          style={{ fontFamily: "var(--font-se)" }}
        >
          Venue
        </p>
        <h1 className="font-display text-3xl">Where to Find Us</h1>
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
          <h2 className="font-display text-xl" style={{ color: "var(--black)" }}>
            Pavillon de la Jamaïque
          </h2>
        </div>
        <div className="p-6">
          <p className="text-sm leading-relaxed opacity-70" style={{ fontFamily: "var(--font-se)" }}>
            Parc Jean-Drapeau<br />
            Montréal, Québec
          </p>
          <p className="mt-4 text-sm opacity-45" style={{ fontFamily: "var(--font-se)" }}>
            More details to follow with your invitation.
          </p>
        </div>
      </div>
    </main>
  );
}
