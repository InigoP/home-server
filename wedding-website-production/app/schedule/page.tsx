import Events from "@/components/Events";
import SceneNav from "@/components/SceneNav";
import ScrollAsset from "@/components/ScrollAsset";

export default function Schedule() {
  return (
    <main className="flex-1">
      <section className="w-full">
        {/* Film section — full-bleed */}
        <div className="sprocket-strip" />

        <div
          className="flex flex-col justify-center py-16"
          style={{ background: "#359c90", minHeight: "var(--hero-height)" }}
        >
          <div className="max-w-4xl mx-auto px-6 mb-10">
            <p
              className="text-[0.65rem] uppercase tracking-[0.4em] opacity-60 mb-1"
              style={{ fontFamily: "var(--font-se)", color: "var(--black)" }}
            >
              Schedule
            </p>
            <h1 className="font-display text-3xl" style={{ color: "var(--black)" }}>
              Weekend of June 6–7
            </h1>
          </div>
          <Events />
        </div>

        <div className="sprocket-strip" />
      </section>

      <ScrollAsset />
      <SceneNav
        prev={{ href: "/", label: "Home" }}
        next={{ href: "/venue", label: "Venue" }}
      />
    </main>
  );
}
