import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import ScrollAsset from "@/components/ScrollAsset";
import Reveal from "@/components/Reveal";
import SceneNext from "@/components/SceneNext";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Reveal><Gallery /></Reveal>
      <ScrollAsset />
      <SceneNext href="/schedule" label="Schedule" />
    </main>
  );
}
