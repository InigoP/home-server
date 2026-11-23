"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Schedule" },
  { href: "/venue", label: "Venue" },
  { href: "/registry", label: "Registry" },
  { href: "/faq", label: "FAQ" },
  { href: "/rsvp", label: "RSVP" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "var(--cream)",
        borderBottom: "2.5px solid var(--black)",
        viewTransitionName: "nav",
      }}
    >
      <ul className="nav-list">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              {...(pathname === l.href ? { "aria-current": "page" } : {})}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
