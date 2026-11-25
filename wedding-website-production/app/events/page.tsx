import EventsSection from "@/components/EventsSection";
import SceneNav from "@/components/SceneNav";
import ScrollAsset from "@/components/ScrollAsset";

export default function EventsPage() {
  return (
    <main className="flex-1">
      <section className="w-full">
        <div className="sprocket-strip" />
        <EventsSection />
      </section>

      <ScrollAsset />
      <SceneNav
        prev={{ href: "/", label: "Home" }}
        next={{ href: "/venue", label: "Venue" }}
      />
    </main>
  );
}
