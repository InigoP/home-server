export default function Gallery() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-serif text-stone-800 text-center">Our Story</h2>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="aspect-square rounded-xl bg-stone-200" />
        ))}
      </div>
    </section>
  );
}
