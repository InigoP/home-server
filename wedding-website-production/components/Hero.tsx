import FlipLink from "@/components/FlipLink";

export default function Hero() {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center bg-[#FAD200] px-6 text-center overflow-hidden">
      <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-[#ED2232] border-2 border-[#020202]" aria-hidden />
      <div className="absolute bottom-6 right-6 rotate-6 border-2 border-[#020202] bg-[#020202] px-4 py-2 text-sm font-bold uppercase tracking-widest text-white" aria-hidden>
        Montréal · 2026
      </div>
      <div>
        <p className="inline-block rotate-[-2deg] border-2 border-[#020202] bg-white px-4 py-1 text-xs font-bold uppercase tracking-[0.5em]">Save the date</p>
        <h1 className="mt-8 font-display text-6xl md:text-8xl uppercase leading-[1.1] tracking-tight text-[#020202]">
          Sonia<br />&amp; Inigo
        </h1>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.3em] text-[#020202]">Sunday, June 7, 2026 · La Toundra, Montréal</p>
        <FlipLink
          href="/rsvp"
          className="mt-10 inline-block rounded-none border-2 border-[#020202] bg-[#ED2232] px-10 py-3 text-sm font-bold uppercase tracking-[0.3em] text-white transition-transform hover:-translate-y-1"
        >
          RSVP
        </FlipLink>
      </div>
    </section>
  );
}
