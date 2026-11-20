"use client";

import { useEffect, useRef, useState } from "react";

const photos = [
  {
    src: "/grand_canyon.jpg",
    // front: "Sonia & Inigo",
    back: "We go camping :)",
  },
  {
    src: "/proposal.jpeg",
    // front: "June 7, 2026",
    back: "Surprise proposal!!",
  },
];

const CARD_WIDTH = 220;
const CARD_HEIGHT = 244; // 220 image + 24 caption strip
const CLICK_THRESHOLD = 6; // px of movement below which a release is treated as a click

export default function Gallery() {
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const zCounter = useRef(photos.length);
  const [flipped, setFlipped] = useState<boolean[]>(() => photos.map(() => false));

  useEffect(() => {
    const cleanups: (() => void)[] = [];

    photoRefs.current.forEach((el, i) => {
      if (!el) return;

      // Push each photo to a side, outside the center hero region.
      const side = i === 0 ? -1 : 1;
      const sideBase = Math.max(window.innerWidth * 0.3, 340);
      const sideJitter = Math.random() * 90;
      const verticalJitter = (Math.random() * 2 - 1) * Math.min(window.innerHeight * 0.22, 200);

      el.style.left = `${side * (sideBase + sideJitter)}px`;
      el.style.top = `${verticalJitter}px`;
      el.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 20 - 10}deg)`;
      el.style.zIndex = String(i + 1);

      let previousTouch: Touch | undefined;
      let dragDistance = 0;
      let interactive = false;

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
        dragDistance += Math.abs(dx) + Math.abs(dy);
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

        if (interactive && dragDistance < CLICK_THRESHOLD) {
          setFlipped((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
        }
        interactive = false;
      }

      function start() {
        dragDistance = 0;
        interactive = true;
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
      className="select-none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 40,
      }}
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
              width: `${CARD_WIDTH}px`,
              height: `${CARD_HEIGHT}px`,
              transform: "translate(-50%, -50%)",
              userSelect: "none",
              cursor: "grab",
              pointerEvents: "auto",
              perspective: "1100px",
              boxShadow: "0 4px 28px rgba(26,21,16,0.28)",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                transformStyle: "preserve-3d",
                transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                transform: flipped[i] ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front: photo + flip hint */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  background: "#fff",
                  padding: "8px 8px 0 8px",
                  boxSizing: "border-box",
                }}
              >
                <img
                  src={photo.src}
                  alt=""
                  draggable={false}
                  style={{
                    display: "block",
                    width: `${CARD_WIDTH - 16}px`,
                    height: `${CARD_WIDTH - 16}px`,
                    objectFit: "cover",
                    pointerEvents: "none",
                    filter: "sepia(0.4) saturate(1.3) contrast(0.9) brightness(1.05) hue-rotate(-8deg)",
                  }}
                />
                <div
                  style={{
                    width: `${CARD_WIDTH - 16}px`,
                    height: "24px",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    gap: "0.4em",
                    paddingBottom: "1px",
                    boxSizing: "border-box",
                    lineHeight: 1,
                    fontFamily: "var(--font-se)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(26, 21, 16, 0.45)",
                  }}
                >
                  <span style={{ fontSize: "0.75rem", lineHeight: 1 }}>↻</span>
                  click to flip
                </div>
              </div>

              {/* Back: handwritten-style note */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: "var(--cream)",
                  padding: "22px 20px",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-se)",
                    fontSize: "0.95rem",
                    lineHeight: 1.55,
                    color: "var(--black)",
                    whiteSpace: "pre-line",
                  }}
                >
                  {photo.back}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[0.78rem] uppercase tracking-[0.2em] opacity-40 pointer-events-none"
        style={{ fontFamily: "var(--font-se)" }}
      >
        click to flip · drag to move
      </p>
    </section>
  );
}
