import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Schedule" },
  { href: "/venue", label: "Venue" },
  { href: "/registry", label: "Registry" },
  { href: "/faq", label: "FAQ" },
  { href: "/rsvp", label: "RSVP" },
];

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50" style={{ background: "var(--black)" }}>
      <div className="flex items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="font-display text-lg leading-none"
          style={{ color: "var(--pink)" }}
        >
          S &amp; I
        </Link>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[0.6rem] uppercase tracking-[0.25em] transition-opacity hover:opacity-100"
              style={{ fontFamily: "var(--font-se)", color: "rgba(245, 241, 230, 0.6)" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="sprocket-strip" />
    </nav>
  );
}
