"use client";

import { useEffect, useRef } from "react";

const photos = [
  { src: "/example_pic.jpg", caption: "Together" },
  { src: "/example_pic.jpg", caption: "June 7, 2026" },
  { src: "/example_pic.jpg", caption: "Montréal" },
  { src: "/example_pic.jpg", caption: "Pavillon de la Jamaïque" },
  { src: "/example_pic.jpg", caption: "Sonia & Inigo" },
];

export default function Gallery() {
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const zCounter = useRef(photos.length);

  useEffect(() => {
    const cleanups: (() => void)[] = [];

    photoRefs.current.forEach((el, i) => {
      if (!el) return;

      const rangeY = Math.min(window.innerHeight * 0.4, 420);
      const rangeX = Math.min(window.innerWidth * 0.4, 520);
      el.style.top = `${Math.random() * rangeY * 2 - rangeY}px`;
      el.style.left = `${Math.random() * rangeX * 2 - rangeX}px`;
      el.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 28 - 14}deg)`;
      el.style.zIndex = String(i + 1);

      let previousTouch: Touch | undefined;

      function update(e: MouseEvent | TouchEvent) {
        let dx: number, dy: number;
        if ("touches" in e) {
          const t = e.touches[0];
          dx = previousTouch ? t.clientX - previousTouch.clientX : 0;
          dy = previousTouch ? t.clientY - previousTouch.clientY : 0;
          previousTouch = t;
        } else {
          dx = (e as MouseEvent).movementX;
          dy = (e as MouseEvent).movementY;
        }
        el!.style.top = `${parseInt(el!.style.top || "0") + dy}px`;
        el!.style.left = `${parseInt(el!.style.left || "0") + dx}px`;
      }

      function stop() {
        previousTouch = undefined;
        el!.style.cursor = "grab";
        document.removeEventListener("mousemove", update);
        document.removeEventListener("touchmove", update);
        document.removeEventListener("mouseup", stop);
        document.removeEventListener("touchend", stop);
      }

      function start() {
        el!.style.zIndex = String(++zCounter.current);
        el!.style.cursor = "grabbing";
        document.addEventListener("mousemove", update);
        document.addEventListener("touchmove", update);
        document.addEventListener("mouseup", stop);
        document.addEventListener("touchend", stop);
      }

      el.addEventListener("mousedown", start);
      el.addEventListener("touchstart", start);

      cleanups.push(() => {
        el.removeEventListener("mousedown", start);
        el.removeEventListener("touchstart", start);
        stop();
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section
      className="relative select-none w-full"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      <div style={{ position: "absolute", top: "50%", left: "50%" }}>
        {photos.map((photo, i) => (
          <div
            key={i}
            ref={(el) => { photoRefs.current[i] = el; }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              background: "#fff",
              padding: "8px 8px 0 8px",
              boxShadow: "0 4px 28px rgba(26,21,16,0.28)",
              transform: "translate(-50%, -50%)",
              userSelect: "none",
              cursor: "grab",
            }}
          >
            <img
              src={photo.src}
              alt={photo.caption}
              style={{
                display: "block",
                width: "220px",
                height: "220px",
                objectFit: "cover",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                width: "220px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-pm)",
                fontSize: "1rem",
                color: "var(--black)",
                letterSpacing: "0.04em",
              }}
            >
              {photo.caption}
            </div>
          </div>
        ))}
      </div>

      <p
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[0.6rem] uppercase tracking-[0.2em] opacity-40 pointer-events-none"
        style={{ fontFamily: "var(--font-se)" }}
      >
        drag to explore
      </p>
    </section>
  );
}
