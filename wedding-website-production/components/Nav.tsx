import Link from "next/link";

export default function Nav() {
  const links = [
    { href: "/", label: "Home" },
    { href: "/schedule", label: "Schedule" },
    { href: "/venue", label: "Venue" },
    { href: "/registry", label: "Registry" },
    { href: "/faq", label: "FAQ" },
    { href: "/rsvp", label: "RSVP" },
  ];
  return (
    <nav className="sticky top-0 z-50 border-b-4 border-[#020202] bg-[#111]">
      <div className="flex flex-wrap justify-center gap-6 py-4 text-xs font-bold uppercase tracking-[0.25em] text-[#FAD200]">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="hover:text-[#ED2232] transition-colors">
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
