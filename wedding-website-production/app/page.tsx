import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import SceneNext from "@/components/SceneNext";

// Used if public/home/ is missing or empty — keeps the home page from breaking
// before the folder is populated.
const FALLBACK_PHOTOS = [
  { src: "/christmas_2.jpg", back: "Merry Christmas!" },
  { src: "/proposal.jpeg", back: "Surprise proposal!!" },
  { src: "/dan_vebby_wed.JPG", back: "Dan & Vebby's wedding" },
  { src: "/will_jen.jpg", back: "Will & Jen's wedding" },
  { src: "/engage_2.JPG", back: "Engagement party!" },
  { src: "/mtl_snow.JPG", back: "Montréal in the snow" },
  { src: "/surf.JPG", back: "Catching waves" },
];

const DISPLAY_COUNT = 7;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function loadGalleryPhotos() {
  const dir = path.join(process.cwd(), "public", "home");

  let files: string[];
  try {
    files = await readdir(dir);
  } catch {
    return FALLBACK_PHOTOS;
  }

  const images = files.filter((f) => /\.(jpe?g|png|webp|gif|avif)$/i.test(f));
  if (images.length === 0) return FALLBACK_PHOTOS;

  let captions: Record<string, string> = {};
  try {
    const raw = await readFile(path.join(dir, "captions.json"), "utf8");
    captions = JSON.parse(raw);
  } catch {
    // captions.json is optional — unlabeled photos just show a blank back
  }

  const pool = images.map((filename) => ({
    src: `/home/${filename}`,
    back: captions[filename] ?? "",
  }));

  // Sample N random photos per request — layout's `headers()` call already
  // marks the tree dynamic, so this runs fresh on every request.
  return shuffle(pool).slice(0, DISPLAY_COUNT);
}

export default async function Home() {
  const photos = await loadGalleryPhotos();
  return (
    <>
      <main className="flex-1">
        <Hero />
        <SceneNext href="/events" label="Events" />
      </main>
      <Gallery photos={photos} />
    </>
  );
}
