const hotels = [
  { name: "Hotel Montréal Example", rate: "$179/night · code SONIA", dist: "1 mi from venue" },
  { name: "Le Petit Hôtel Example", rate: "$139/night · code INIGO", dist: "2 mi from venue" },
];

export default function Accommodations() {
  return (
    <section className="bg-[#020202] px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-center text-xs uppercase tracking-[0.5em] text-white/80">Accommodations</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {hotels.map((h) => (
            <div key={h.name} className="border-2 border-[#020202] bg-white p-6">
              <h3 className="text-lg font-semibold text-[#020202]">{h.name}</h3>
              <p className="mt-2 text-sm text-[#444]">{h.rate}</p>
              <p className="text-sm text-[#777]">{h.dist}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
