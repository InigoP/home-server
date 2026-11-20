"use client";

import { usePathname } from "next/navigation";

export default function SideSprockets() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return (
    <>
      <div className="sprocket-strip-v fixed top-0 bottom-0 left-0 z-40" />
      <div className="sprocket-strip-v fixed top-0 bottom-0 right-0 z-40" />
    </>
  );
}
