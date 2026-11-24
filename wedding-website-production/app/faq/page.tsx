import Accommodations from "@/components/Accommodations";
import SceneNav from "@/components/SceneNav";

export default function Faq() {
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
                FAQ
              </p>
              <h1 className="font-display text-3xl" style={{ color: "var(--black)" }}>
                Frequently Asked
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
                <span className="font-display" style={{ fontSize: "1rem", color: "var(--black)" }}>
                  Answers incoming
                </span>
              </div>
              <div className="p-6">
                <p className="text-sm leading-relaxed opacity-60" style={{ fontFamily: "var(--font-se)" }}>
                  Dress code, plus-ones, parking, and more — coming soon.
                </p>
                <img
                  src="/example_pic.jpg"
                  alt="Example venue"
                  className="mt-6 w-full"
                  style={{ border: "2px solid var(--black)" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="sprocket-strip" />
      </section>

      <Accommodations />

      <SceneNav
        prev={{ href: "/registry", label: "Registry" }}
        next={{ href: "/rsvp", label: "RSVP" }}
      />
    </main>
  );
}
