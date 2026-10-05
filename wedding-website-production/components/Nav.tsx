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
    <nav className="flex flex-wrap justify-center gap-6 border-b border-stone-200 py-4 text-sm text-stone-600">
      {links.map((l) => (
        <Link key={l.href} href={l.href} className="hover:text-stone-900 transition-colors">
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
