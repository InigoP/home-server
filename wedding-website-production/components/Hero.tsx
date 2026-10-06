import FlipLink from "@/components/FlipLink";

export default function Hero() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center bg-stone-200 px-6 text-center">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-stone-600">Save the date</p>
        <h1 className="mt-4 font-serif text-6xl text-stone-800">Sonia &amp; Inigo</h1>
        <p className="mt-4 text-stone-600">Sunday, June 7, 2026 · La Toundra, Montréal</p>
        <FlipLink
          href="/rsvp"
          className="mt-8 inline-block rounded-full bg-stone-800 px-8 py-3 text-white hover:bg-stone-700 transition-colors"
        >
          RSVP
        </FlipLink>
      </div>
    </section>
  );
}
