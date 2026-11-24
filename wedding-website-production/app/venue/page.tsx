import SceneNav from "@/components/SceneNav";

export default function Venue() {
  return (
    <main className="flex-1">
      <section className="w-full">
        <div className="sprocket-strip" />

        <div
          className="flex flex-col justify-center py-16"
          style={{ background: "#359c90", minHeight: "var(--hero-height)" }}
        >
          <div className="max-w-2xl mx-auto px-6 w-full">
            <div className="mb-10">
              <p
                className="text-[0.65rem] uppercase tracking-[0.4em] opacity-60 mb-1"
                style={{ fontFamily: "var(--font-se)", color: "var(--black)" }}
              >
                Venue
              </p>
              <h1 className="font-display text-3xl" style={{ color: "var(--black)" }}>
                Where to Find Us
              </h1>
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
                <h2 className="font-display text-xl" style={{ color: "var(--black)" }}>
                  Pavillon de la Jamaïque
                </h2>
              </div>
              <div className="p-6">
                <p className="text-sm leading-relaxed opacity-70" style={{ fontFamily: "var(--font-se)" }}>
                  Parc Jean-Drapeau<br />
                  Montréal, Québec
                </p>
                <p className="mt-4 text-sm opacity-45" style={{ fontFamily: "var(--font-se)" }}>
                  More details to follow with your invitation.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="sprocket-strip" />
      </section>

      <SceneNav
        prev={{ href: "/schedule", label: "Schedule" }}
        next={{ href: "/registry", label: "Registry" }}
      />
    </main>
  );
}
