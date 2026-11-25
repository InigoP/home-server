"use client";

import { useEffect, useState } from "react";

export default function ScrollAsset() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY * 0.45);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed bottom-[15%] left-1/10 z-10 transition-transform duration-100"
      style={{ transform: `translateY(-${offset}px)` }}
      aria-hidden
    >
      <img
        src="/photostrip.jpg"
        alt=""
        draggable={false}
        className="h-auto max-h-[35vh] w-auto -rotate-3 select-none border-4 p-2 sm:max-h-[55vh]"
        style={{
          borderColor: "var(--black)",
          background: "var(--cream)",
        }}
      />
    </div>
  );
}
