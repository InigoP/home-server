"use client";

import { useEffect, useRef, useState } from "react";

type Photo = { src: string; back: string };

interface Props {
  photos: Photo[];
}

const CARD_WIDTH = 220;
const CARD_HEIGHT = 244; // 220 image + 24 caption strip
const CLICK_THRESHOLD = 6; // px of movement below which a release is treated as a click

export default function Gallery({ photos }: Props) {
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const zCounter = useRef(photos.length);
  const [flipped, setFlipped] = useState<boolean[]>(() => photos.map(() => false));
  // Visibility driven by state so React's reconciliation never clobbers a
  // direct DOM mutation after the position effect runs (dev-mode bug).
  const [visible, setVisible] = useState<boolean[]>(() => photos.map(() => false));
  // Shuffle which photo lands in each slot on mount (slot positions stay fixed)
  const [displayOrder, setDisplayOrder] = useState<number[]>(() => photos.map((_, i) => i));

  useEffect(() => {
    const arr = photos.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setDisplayOrder(arr);
  }, []);

  useEffect(() => {
    const cleanups: (() => void)[] = [];

    // ~25% overlap: cards still kiss but leave breathing room between them
    const OVERLAP = 0.25;
    const perSide = [0, 0];
    const sideIndex: number[] = [];
    const sideFor: number[] = [];
    // Flip which side gets the first (and therefore extra) card each mount,
    // so sometimes the left stack is taller and sometimes the right.
    const startSide = Math.random() < 0.5 ? 0 : 1;
    photos.forEach((_, i) => {
      const s = i % 2 === 0 ? startSide : 1 - startSide;
      sideFor[i] = s;
      sideIndex[i] = perSide[s]++;
    });

    // Distinct horizontal slot (0..1) for each card on its side, shuffled so the
    // stack doesn't form a staircase.
    const hSlots: number[][] = [[], []];
    for (let s = 0; s < 2; s++) {
      const n = perSide[s];
      const slots = Array.from({ length: n }, (_, k) => (n > 1 ? k / (n - 1) : 0.5));
      for (let k = n - 1; k > 0; k--) {
        const j = Math.floor(Math.random() * (k + 1));
        [slots[k], slots[j]] = [slots[j], slots[k]];
      }
      hSlots[s] = slots;
    }

    photoRefs.current.forEach((el, i) => {
      if (!el) return;

      const side = sideFor[i] === 0 ? -1 : 1;
      const countOnSide = perSide[sideFor[i]];
      const sIdx = sideIndex[i];
      const isMobile = window.innerWidth < 640;

      // Card scale affects the on-screen footprint used for overlap math
      const mobileScale = isMobile ? 0.35 : 0.75;
      const effCardH = CARD_HEIGHT * mobileScale;

      const verticalJitter = (Math.random() * 2 - 1) * (isMobile ? 40 : 28);
      let topOffset: number;
      if (isMobile) {
        // Mobile: distribute cards from just below the nav to well past the
        // viewport fold, scaling with actual phone height.
        const effCardHalfH = (CARD_HEIGHT / 2) * mobileScale;
        const navClearance = 70;
        const minYCenter = navClearance + effCardHalfH;
        const maxYCenter = window.innerHeight + 150 - effCardHalfH;
        const yCenter = countOnSide > 1
          ? minYCenter + (sIdx / (countOnSide - 1)) * (maxYCenter - minYCenter)
          : (minYCenter + maxYCenter) / 2;
        topOffset = yCenter - window.innerHeight * 0.5 + verticalJitter;
      } else {
        // Desktop: stack centered on hero with the overlap value from OVERLAP,
        // then nudge downward so the bottom cards spill past the fold.
        const step = effCardH * (1 - OVERLAP);
        const stackTop = -((countOnSide - 1) * step) / 2;
        const desktopDownShift = window.innerHeight * 0.07;
        topOffset = stackTop + sIdx * step + verticalJitter + desktopDownShift;
      }

      // Final guard: no card's top edge may cross into the fixed nav bar,
      // regardless of jitter or scatter math.
      const navHeight = 66;
      const effCardHalfH = (CARD_HEIGHT / 2) * mobileScale;
      const minTopOffset = navHeight + effCardHalfH - window.innerHeight * 0.5;
      if (topOffset < minTopOffset) topOffset = minTopOffset;

      // Estimate half-width of the hero "Sonia & Inigo" name block from its
      // clamp(3.9rem, 13vw, 6.5rem) font rule (15px root). Cards sit just outside
      // this plus their own half-width + a few pixels of clearance.
      const nameFontPx = Math.min(Math.max(0.13 * window.innerWidth, 58.5), 97.5);
      const nameHalfWidth = nameFontPx * 2.4 + 30;
      const effCardHalfW = (CARD_WIDTH / 2) * mobileScale;
      const nameClearance = nameHalfWidth + effCardHalfW + 8;

      // Cap how far from center we're allowed to place a card so it stays on-screen
      const maxInner = window.innerWidth / 2 - effCardHalfW - 6;

      // Horizontal band per side (inner edge → outer edge from screen center)
      const innerEdgeRaw = Math.max(
        isMobile ? window.innerWidth * 0.1 : Math.max(window.innerWidth * 0.2, 280),
        nameClearance
      );
      const innerEdge = Math.min(innerEdgeRaw, maxInner);
      const outerEdgeRaw = isMobile
        ? window.innerWidth * 0.42
        : Math.min(window.innerWidth * 0.55, 760);
      const outerEdge = Math.min(Math.max(outerEdgeRaw, innerEdge + 20), maxInner);
      const hT = hSlots[sideFor[i]][sIdx];
      const sideDist = innerEdge + hT * (outerEdge - innerEdge);
      // Outward-only jitter so cards can't drift back into the name block
      const jitterMax = Math.min(isMobile ? 32 : 35, Math.max(0, maxInner - sideDist));
      const sideJitter = Math.random() * jitterMax;
      const leftOffset = side * (sideDist + sideJitter);

      el.style.left = `${leftOffset}px`;
      el.style.top = `${topOffset}px`;
      el.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 20 - 10}deg) scale(${mobileScale})`;
      el.style.zIndex = String(i + 1);

      // Keep mobile touches from scrolling the page while dragging
      el.style.touchAction = "none";

      let dragging = false;
      let dragDistance = 0;
      let startX = 0;
      let startY = 0;
      let startLeft = 0;
      let startTop = 0;
      let pendingLeft = 0;
      let pendingTop = 0;
      let rafId: number | null = null;

      function flush() {
        rafId = null;
        el!.style.left = `${pendingLeft}px`;
        el!.style.top = `${pendingTop}px`;
      }

      function onPointerDown(e: PointerEvent) {
        dragging = true;
        dragDistance = 0;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = parseFloat(el!.style.left) || 0;
        startTop = parseFloat(el!.style.top) || 0;
        pendingLeft = startLeft;
        pendingTop = startTop;
        try { el!.setPointerCapture(e.pointerId); } catch {}
        el!.style.zIndex = String(++zCounter.current);
        el!.style.cursor = "grabbing";
      }

      function onPointerMove(e: PointerEvent) {
        if (!dragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        dragDistance = Math.abs(dx) + Math.abs(dy);
        pendingLeft = startLeft + dx;
        pendingTop = startTop + dy;

        // Clamp top so the card's top edge can't cross into the fixed nav bar.
        // Card center in viewport Y = 50vh + pendingTop (inner div sits at 50vh).
        const navHeight = 66;
        const scaleNow = window.innerWidth < 640 ? 0.45 : 1;
        const cardHalfH = (CARD_HEIGHT / 2) * scaleNow;
        const minTop = navHeight + cardHalfH - window.innerHeight * 0.5;
        if (pendingTop < minTop) pendingTop = minTop;

        if (rafId === null) rafId = requestAnimationFrame(flush);
      }

      function onPointerUp(e: PointerEvent) {
        if (!dragging) return;
        dragging = false;
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
          flush();
        }
        try { el!.releasePointerCapture(e.pointerId); } catch {}
        el!.style.cursor = "grab";
        if (dragDistance < CLICK_THRESHOLD) {
          setFlipped((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
        }
      }

      el.addEventListener("pointerdown", onPointerDown);
      el.addEventListener("pointermove", onPointerMove);
      el.addEventListener("pointerup", onPointerUp);
      el.addEventListener("pointercancel", onPointerUp);

      cleanups.push(() => {
        el.removeEventListener("pointerdown", onPointerDown);
        el.removeEventListener("pointermove", onPointerMove);
        el.removeEventListener("pointerup", onPointerUp);
        el.removeEventListener("pointercancel", onPointerUp);
        if (rafId !== null) cancelAnimationFrame(rafId);
      });
    });

    // Now that every card is positioned, flip the visibility flags through state
    // so the JSX reflects the real DOM state and React won't overwrite it later.
    setVisible(photos.map(() => true));

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
        overflow: "visible",
        pointerEvents: "none",
        zIndex: 40,
      }}
    >
      <div style={{ position: "absolute", top: "50%", left: "50%" }}>
        {displayOrder.map((photoIdx, i) => {
          const photo = photos[photoIdx];
          return (
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
              visibility: visible[i] ? "visible" : "hidden",
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
                  decoding="async"
                  style={{
                    display: "block",
                    width: `${CARD_WIDTH - 16}px`,
                    height: `${CARD_WIDTH - 16}px`,
                    objectFit: "cover",
                    pointerEvents: "none",
                    // Warm a few cool-leaning photos with a touch of sepia;
                    // the rest get the standard saturation/contrast lift.
                    filter: /(will_jen|kayak|hiking)/i.test(photo.src)
                      ? "sepia(0.1) saturate(1.15) contrast(1.05) hue-rotate(-15deg)"
                      : "saturate(1.03) contrast(1.05)",
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
          );
        })}
      </div>
    </section>
  );
}
