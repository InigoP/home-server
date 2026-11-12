export default function Faq() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p
          className="text-[0.65rem] uppercase tracking-[0.4em] opacity-50 mb-1"
          style={{ fontFamily: "var(--font-se)" }}
        >
          FAQ
        </p>
        <h1 className="font-display text-3xl">Frequently Asked</h1>
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
            Answers incoming
          </span>
        </div>
        <div className="p-6">
          <p className="text-sm leading-relaxed opacity-60" style={{ fontFamily: "var(--font-se)" }}>
            Dress code, plus-ones, parking, and more — coming soon.
          </p>
          <img
            src="/example_pic.jpg"
            alt="Example venue"
            className="mt-6 w-full"
            style={{ border: "2px solid var(--black)" }}
          />
        </div>
      </div>
    </main>
  );
}
