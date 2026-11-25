import Link from "next/link";

interface Event {
  act: string;
  title: string;
  date: string;
  place: string;
  desc: string;
  href?: string;
}

interface Props {
  onActClick?: (href: string) => void;
}

const events: Event[] = [
  {
    act: "01",
    title: "Welcome Party",
    date: "Sunday, June 6 · 7:00 PM",
    place: "Montréal",
    desc: "Casual drinks and mingling.",
    href: "#welcome-party",
  },
  {
    act: "02",
    title: "Ceremony and Reception",
    date: "Monday, June 7 · 4:00 PM until 2 AM",
    place: "Pavillon de la Jamaïque",
    desc: "Please arrive by 3:45 PM.",
    href: "#ceremony",
  },
  {
    act: "03",
    title: "TBD",
    date: "TBD",
    place: "TBD",
    desc: "TBD",
  },
];

export default function Events({ onActClick }: Props) {
  return (
    <section className="max-w-4xl mx-auto px-6">
      <div className="grid gap-6 sm:grid-cols-3">
        {events.map((e) => {
          const card = (
            <div
              className="card-lift h-full"
              style={{
                border: "2.5px solid var(--black)",
                background: "var(--cream)",
              }}
            >
            <div
              style={{
                background: "var(--blue-purple)",
                borderBottom: "2.5px solid var(--black)",
                padding: "0.6rem 1.25rem",
                display: "flex",
                alignItems: "baseline",
                gap: "0.5rem",
              }}
            >
              <span className="font-display" style={{ color: "var(--cream)", fontSize: "1rem" }}>
                Act {e.act}
              </span>
              <span
                className="text-[0.5rem] uppercase tracking-[0.15em] opacity-70"
                style={{ fontFamily: "var(--font-se)", color: "var(--cream)" }}
              >
                / {e.title}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg" style={{ color: "var(--black)" }}>
                {e.title}
              </h3>
              <p className="mt-2 text-sm opacity-70" style={{ fontFamily: "var(--font-se)" }}>
                {e.date}
              </p>
              <p className="text-sm opacity-70" style={{ fontFamily: "var(--font-se)" }}>
                {e.place}
              </p>
              <p className="mt-3 text-sm opacity-50" style={{ fontFamily: "var(--font-se)" }}>
                {e.desc}
              </p>
            </div>
            </div>
          );

          if (e.href?.startsWith("#") && onActClick) {
            return (
              <button
                key={e.title}
                onClick={() => onActClick(e.href!)}
                className="block w-full text-left"
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
              >
                {card}
              </button>
            );
          }
          if (e.href) {
            return (
              <Link
                key={e.title}
                href={e.href}
                className="block"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {card}
              </Link>
            );
          }
          return <div key={e.title}>{card}</div>;
        })}
      </div>
    </section>
  );
}
