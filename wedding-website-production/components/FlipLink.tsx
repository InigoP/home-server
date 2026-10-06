"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FlipLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const [flipped, setFlipped] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setFlipped(true);
    setTimeout(() => router.push(href), 500);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      style={{
        display: "inline-block",
        transition: "transform 0.5s ease-in-out",
        transform: flipped
          ? "perspective(600px) rotateY(-180deg)"
          : "perspective(600px) rotateY(0deg)",
      }}
    >
      {children}
    </a>
  );
}
