import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import SceneNext from "@/components/SceneNext";
import FilmCountdown from "@/components/FilmCountdown";

export default function Home() {
  return (
    <>
      <FilmCountdown />
      <main className="flex-1">
        <Hero />
        <SceneNext href="/schedule" label="Schedule" />
      </main>
      <Gallery />
    </>
  );
}
