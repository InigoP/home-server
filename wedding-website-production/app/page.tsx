import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import SceneNext from "@/components/SceneNext";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <SceneNext href="/schedule" label="Schedule" />
      </main>
      <Gallery />
    </>
  );
}
