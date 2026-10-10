const photos = [1, 2, 3, 4];

export default function Gallery() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-24">
      <h2 className="text-center text-xs uppercase tracking-[0.5em] text-[#444]">Our Story</h2>
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {photos.map((n) => (
          <figure key={n} className="group overflow-hidden">
            <div className="aspect-square bg-white border-2 border-[#020202]">
              <img
                src="/example_pic.jpg"
                alt={`Photo ${n}`}
                className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <figcaption className="mt-3 text-center text-[0.65rem] uppercase tracking-[0.3em] text-[#777]">
              0{n}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
