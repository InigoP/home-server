"use client";

import { useEffect, useState } from "react";

export default function ScrollAsset() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY * 0.3);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed bottom-8 right-8 z-10 text-5xl transition-transform duration-75"
      style={{ transform: `translateY(-${offset}px)` }}
      aria-hidden
    >
      🎈
    </div>
  );
}
