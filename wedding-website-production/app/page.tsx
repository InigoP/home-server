import Hero from "@/components/Hero";
import Events from "@/components/Events";
import Accommodations from "@/components/Accommodations";
import Gallery from "@/components/Gallery";
import ScrollAsset from "@/components/ScrollAsset";

export default function Home() {
  return (
    <main className="flex-1 bg-stone-50">
      <Hero />
      <Events />
      <Accommodations />
      <Gallery />
      <ScrollAsset />
    </main>
  );
}
