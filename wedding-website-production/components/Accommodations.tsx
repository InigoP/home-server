const hotels = [
  { name: "Hotel Montréal Example", rate: "$179/night · code SONIA", dist: "1 mi from venue" },
  { name: "Le Petit Hôtel Example", rate: "$139/night · code INIGO", dist: "2 mi from venue" },
];

export default function Accommodations() {
  return (
    <section className="bg-stone-100 px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-serif text-stone-800 text-center">Accommodations</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {hotels.map((h) => (
            <div key={h.name} className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-stone-800">{h.name}</h3>
              <p className="mt-2 text-sm text-stone-600">{h.rate}</p>
              <p className="text-sm text-stone-500">{h.dist}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
