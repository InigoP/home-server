const schedule = [
  {
    scene: "01",
    title: "Welcome Party",
    day: "Saturday, June 6",
    time: "7:00 PM",
    location: "TBD — Montréal",
    note: "Casual dress welcome.",
  },
  {
    scene: "02",
    title: "Ceremony",
    day: "Sunday, June 7",
    time: "4:00 PM",
    location: "Pavillon de la Jamaïque",
    note: "Please arrive by 3:45 PM.",
  },
  {
    scene: "03",
    title: "Reception",
    day: "Sunday, June 7",
    time: "6:00 PM",
    location: "Pavillon de la Jamaïque",
    note: "Dinner, dancing, and toasts.",
  },
];

export default function Schedule() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p
          className="text-[0.65rem] uppercase tracking-[0.4em] opacity-50 mb-1"
          style={{ fontFamily: "var(--font-se)" }}
        >
          Schedule
        </p>
        <h1 className="font-display text-3xl">Weekend of June 6–7</h1>
      </div>

      <div
        style={{
          border: "2.5px solid var(--black)",
          boxShadow: "5px 5px 0 var(--black)",
          background: "var(--cream)",
          overflow: "hidden",
        }}
      >
        {/* Film strip header */}
        <div className="sprocket-strip" />
        <div
          className="text-center py-2 px-4 text-[0.55rem] uppercase tracking-[0.2em]"
          style={{
            background: "var(--black)",
            color: "rgba(245, 241, 230, 0.4)",
            fontFamily: "var(--font-se)",
          }}
        >
          Sonia &amp; Inigo &nbsp;·&nbsp; Ext. Montréal &nbsp;·&nbsp; June 2026
        </div>
        <div className="sprocket-strip" />

        {/* Events */}
        {schedule.map((item, i) => (
          <div
            key={item.scene}
            style={{
              borderTop: i > 0 ? "1.5px dashed rgba(26,21,16,0.15)" : undefined,
              padding: "1.25rem 1.5rem",
            }}
          >
            <div className="flex items-start gap-4">
              <span
                className="font-display leading-none opacity-20 shrink-0"
                style={{ fontSize: "2.5rem", minWidth: "2.5rem" }}
              >
                {item.scene}
              </span>
              <div className="flex-1">
                <h2 className="font-display text-lg" style={{ color: "var(--black)" }}>
                  {item.title}
                </h2>
                <p className="text-sm mt-1 opacity-70" style={{ fontFamily: "var(--font-se)" }}>
                  {item.day} &nbsp;·&nbsp; {item.time}
                </p>
                <p className="text-sm opacity-70" style={{ fontFamily: "var(--font-se)" }}>
                  {item.location}
                </p>
                <p className="text-sm mt-2 opacity-45" style={{ fontFamily: "var(--font-se)" }}>
                  {item.note}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
