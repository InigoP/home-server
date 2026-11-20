"use client";

import { useEffect, useRef, useState } from "react";
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
  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function onScroll() {
      const current = window.scrollY;
      if (current < 60) {
        setVisible(false);
      } else if (current < lastScrollY.current) {
        setVisible(true);
      } else {
        setVisible(false);
      }
      lastScrollY.current = current;
    }

    function onMouseMove(e: MouseEvent) {
      if (e.clientY < 60) setVisible(true);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

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
        transform: visible ? "translateY(0)" : "translateY(-110%)",
        transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
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
