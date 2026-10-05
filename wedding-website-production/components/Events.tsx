const events = [
  { title: "Welcome Party", date: "Saturday, June 6 · 7:00 PM", place: "Montréal", desc: "Casual drinks and mingling." },
  { title: "Ceremony", date: "Sunday, June 7 · 4:00 PM", place: "La Toundra", desc: "Please arrive by 3:45 PM." },
  { title: "Reception", date: "Sunday, June 7 · 6:00 PM", place: "La Toundra", desc: "Dinner, dancing, and toasts." },
];

export default function Events() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-serif text-stone-800 text-center">Events</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {events.map((e) => (
          <div key={e.title} className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-800">{e.title}</h3>
            <p className="mt-2 text-sm text-stone-600">{e.date}</p>
            <p className="text-sm text-stone-600">{e.place}</p>
            <p className="mt-3 text-sm text-stone-500">{e.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
