"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
  const [open, setOpen] = useState(false);

  return (
    <nav
      className={open ? "nav-open" : ""}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2000,
        background: "var(--cream)",
        borderBottom: "2.5px solid var(--black)",
        viewTransitionName: "nav",
      }}
    >
      <button
        className="nav-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "✕" : "☰"}
      </button>
      <ul className="nav-list">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              onClick={() => setOpen(false)}
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
