const hotels = [
  { name: "Hotel Montréal Example", rate: "$179/night · code SONIA", dist: "1 mi from venue" },
  { name: "Le Petit Hôtel Example", rate: "$139/night · code INIGO", dist: "2 mi from venue" },
];

export default function Accommodations() {
  return (
    <section className="px-6 py-16" style={{ background: "var(--black)" }}>
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-center mb-10 text-[0.65rem] uppercase tracking-[0.4em]"
          style={{ fontFamily: "var(--font-se)", color: "rgba(245, 241, 230, 0.4)" }}
        >
          Accommodations
        </h2>
        <div className="grid gap-10 sm:grid-cols-2">
          {hotels.map((h, i) => (
            <div
              key={h.name}
              className="relative"
              style={{ transform: i % 2 === 0 ? "rotate(-0.6deg)" : "rotate(0.6deg)" }}
            >
              {/* Yellow tape — left */}
              <div
                className="absolute -top-[11px] left-[14%] w-[52px] h-[17px] z-10"
                style={{
                  background: "rgba(255, 228, 40, 0.75)",
                  border: "1px solid rgba(0,0,0,0.1)",
                  transform: "rotate(-2.5deg)",
                }}
              />
              {/* Yellow tape — right */}
              <div
                className="absolute -top-[11px] right-[14%] w-[52px] h-[17px] z-10"
                style={{
                  background: "rgba(255, 228, 40, 0.75)",
                  border: "1px solid rgba(0,0,0,0.1)",
                  transform: "rotate(2.5deg)",
                }}
              />
              <div
                style={{
                  border: "2.5px solid var(--cream)",
                  boxShadow: "5px 5px 0 rgba(245,241,230,0.2)",
                  background: "var(--cream)",
                }}
              >
                <div
                  style={{
                    background: "var(--yellow)",
                    borderBottom: "2.5px solid var(--black)",
                    padding: "0.65rem 1.5rem",
                  }}
                >
                  <h3 className="font-display" style={{ fontSize: "1.1rem", color: "var(--black)" }}>
                    {h.name}
                  </h3>
                </div>
                <div className="p-5">
                  <p className="text-sm" style={{ fontFamily: "var(--font-se)", color: "var(--black)", opacity: 0.7 }}>
                    {h.rate}
                  </p>
                  <p className="mt-1 text-sm opacity-50" style={{ fontFamily: "var(--font-se)", color: "var(--black)" }}>
                    {h.dist}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
