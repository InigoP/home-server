const photos = [1, 2, 3, 4];

export default function Gallery() {
  return (
    <section className="py-24">
      <h2
        className="text-center mb-12 text-[0.65rem] uppercase tracking-[0.4em] opacity-50 px-6"
        style={{ fontFamily: "var(--font-se)" }}
      >
        Our Story
      </h2>

      {/* Horizontal film strip */}
      <div className="overflow-x-auto">
        <div
          style={{
            background: "var(--black)",
            display: "flex",
            flexDirection: "column",
            minWidth: "100%",
          }}
        >
          <div className="sprocket-strip" />

          <div style={{ display: "flex", gap: "4px", padding: "8px 4px" }}>
            {photos.map((n) => (
              <div
                key={n}
                className="group"
                style={{ flex: 1, minWidth: "160px", position: "relative" }}
              >
                <div style={{ aspectRatio: "1", overflow: "hidden" }}>
                  <img
                    src="/example_pic.jpg"
                    alt={`Photo ${n}`}
                    className="transition duration-700 ease-out group-hover:scale-105"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
                <span
                  className="font-display text-xs"
                  style={{
                    position: "absolute",
                    bottom: "6px",
                    right: "8px",
                    color: "rgba(245, 241, 230, 0.4)",
                  }}
                >
                  0{n}
                </span>
              </div>
            ))}
          </div>

          <div className="sprocket-strip" />
        </div>
      </div>
    </section>
  );
}
