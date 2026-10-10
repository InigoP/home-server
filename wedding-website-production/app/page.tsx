import Hero from "@/components/Hero";
import Events from "@/components/Events";
import Accommodations from "@/components/Accommodations";
import Gallery from "@/components/Gallery";
import ScrollAsset from "@/components/ScrollAsset";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <main className="flex-1 bg-white">
      <Hero />
      <Reveal><Events /></Reveal>
      <Reveal><Accommodations /></Reveal>
      <Reveal><Gallery /></Reveal>
      <ScrollAsset />
    </main>
  );
}
