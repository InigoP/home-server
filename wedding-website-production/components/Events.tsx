const events = [
  {
    scene: "01",
    title: "Welcome Party",
    date: "Saturday, June 6 · 7:00 PM",
    place: "Montréal",
    desc: "Casual drinks and mingling.",
  },
  {
    scene: "02",
    title: "Ceremony",
    date: "Sunday, June 7 · 4:00 PM",
    place: "Pavillon de la Jamaïque",
    desc: "Please arrive by 3:45 PM.",
  },
  {
    scene: "03",
    title: "Reception",
    date: "Sunday, June 7 · 6:00 PM",
    place: "Pavillon de la Jamaïque",
    desc: "Dinner, dancing, and toasts.",
  },
];

export default function Events() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <h2
        className="text-center mb-10 text-[0.65rem] uppercase tracking-[0.4em] opacity-50"
        style={{ fontFamily: "var(--font-se)" }}
      >
        Events
      </h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {events.map((e) => (
          <div
            key={e.title}
            style={{
              border: "2.5px solid var(--black)",
              boxShadow: "5px 5px 0 var(--black)",
              background: "var(--cream)",
            }}
          >
            <div
              style={{
                background: "var(--yellow)",
                borderBottom: "2.5px solid var(--black)",
                padding: "0.6rem 1.25rem",
                display: "flex",
                alignItems: "baseline",
                gap: "0.5rem",
              }}
            >
              <span className="font-display" style={{ color: "var(--black)", fontSize: "1rem" }}>
                Scene {e.scene}
              </span>
              <span
                className="text-[0.5rem] uppercase tracking-[0.15em] opacity-50"
                style={{ fontFamily: "var(--font-se)" }}
              >
                / {e.title}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg" style={{ color: "var(--black)" }}>
                {e.title}
              </h3>
              <p className="mt-2 text-sm opacity-70" style={{ fontFamily: "var(--font-se)" }}>
                {e.date}
              </p>
              <p className="text-sm opacity-70" style={{ fontFamily: "var(--font-se)" }}>
                {e.place}
              </p>
              <p className="mt-3 text-sm opacity-50" style={{ fontFamily: "var(--font-se)" }}>
                {e.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
