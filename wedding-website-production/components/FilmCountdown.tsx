"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const START_COUNT = 10;

export default function FilmCountdown() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const counterRef = useRef<SVGTextElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const demo = svgRef.current;
    const container = containerRef.current;
    const counter = counterRef.current;
    if (!demo || !container || !counter) return;

    let count = START_COUNT;
    counter.textContent = String(count);

    const circumference = 2 * Math.PI * 250; // mask circle r=250

    const ctx = gsap.context(() => {
      gsap.set(demo, { transformOrigin: "center", autoAlpha: 1 });
      gsap.set("#rightLeg", { transformOrigin: "0% 0%", rotation: 30, x: 5 });
      gsap.set("#leftLeg", { transformOrigin: "100% 0%", rotation: -30, x: -5 });
      gsap.set("#screenBars, #shadow", { transformOrigin: "50% 50%" });
      gsap.set("#rotator, #supports", { transformOrigin: "50% 100%" });
      gsap.set("#shadow", { scaleX: 0, autoAlpha: 0 });
      gsap.set("#screen", { transformOrigin: "50% 0%", scaleY: 0 });
      gsap.set("#centerShadowBottom, #film", { autoAlpha: 0 });
      gsap.set(".big", {
        strokeDasharray: circumference,
        strokeDashoffset: circumference,
      });

      const changeIt = () => {
        count--;
        if (count > 0) counter.textContent = String(count);
      };

      const projector = () => {
        const tl = gsap.timeline();
        tl.from("#supports", { scaleY: 0, duration: 0.6, ease: "expo.inOut" })
          .addLabel("legExtension")
          .to("#rightLeg", { rotation: 0, x: 0, duration: 0.4, ease: "power2.out" }, "legExtension")
          .to("#leftLeg",  { rotation: 0, x: 0, duration: 0.4, ease: "power2.out" }, "legExtension")
          .from("#screenBars", { scaleX: 0, duration: 0.6, ease: "expo.out" }, "legExtension")
          .to("#centerShadowBottom", { autoAlpha: 1, duration: 0.3 }, "legExtension")
          .addLabel("screenDown", "-=0.25")
          .to("#screen", { scaleY: 1, duration: 0.6, ease: "power4.out" }, "screenDown")
          .from("#screenBottom, #centerShadowBottom", { y: -569, duration: 0.6, ease: "power4.out" }, "screenDown")
          .to("#shadow", { scaleX: 1, autoAlpha: 0.2, duration: 0.6, ease: "power4.out" }, "screenDown")
          .to("#film", { autoAlpha: 1, duration: 1.5 });
        return tl;
      };

      const theCount = () => {
        const tl = gsap.timeline({ repeat: count - 1, onRepeat: changeIt });
        tl.to("#rotator", { rotation: 360, duration: 1, ease: "none" })
          .fromTo(
            ".big",
            { strokeDashoffset: circumference },
            { strokeDashoffset: 0, duration: 1, ease: "none" },
            0
          );
        return tl;
      };

      const master = gsap.timeline({
        delay: 0.1,
        onComplete: () => {
          gsap.to(container, {
            autoAlpha: 0,
            duration: 0.6,
            onComplete: () => setDone(true),
          });
        },
      });

      master.add(projector()).add(theCount(), "-=1.5");
    }, container);

    return () => ctx.revert();
  }, []);

  if (done) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 1200"
        style={{
          width: "min(100vw, 100vh)",
          height: "min(100vw, 100vh)",
          visibility: "hidden",
          opacity: 0,
          fontFamily: "var(--font-pm), sans-serif",
          fontWeight: 700,
        }}
      >
        <defs>
          <radialGradient id="filmGradient" cx="600" cy="450" r="340" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#e6e6e6" />
            <stop offset="0.1" stopColor="#d1d1d1" />
            <stop offset="1" stopColor="#1a1a1a" />
          </radialGradient>
          <mask id="filmMask">
            <circle
              className="big"
              cx="600"
              cy="450"
              transform="rotate(-90 600 450)"
              r="250"
              stroke="#fff"
              strokeWidth="500"
              fill="none"
            />
          </mask>
        </defs>

        <title>Film Countdown</title>
        <ellipse id="shadow" cx="600" cy="1080.97" rx="375" ry="13" fill="#111" opacity="0.15" />

        <g id="screenMaster">
          <g id="supports" transform="translate(5,0)">
            <rect id="centerStand" x="583.78" y="117.91" width="18.76" height="718.65" fill="#878787" />
            <g id="leftLeg">
              <polygon
                id="ltLeg"
                points="442.91 1081.74 420.74 1082.24 586.17 796.3 602.41 805.69 442.91 1081.74"
                fill="#878787"
              />
              <path
                id="ltFoot"
                d="M447.28,1078.95a4.14,4.14,0,0,1-4.14,4.14h-21.9a4.14,4.14,0,0,1-4.14-4.14h0a4.14,4.14,0,0,1,4.14-4.14h21.9a4.14,4.14,0,0,1,4.14,4.14h0Z"
                fill="#f9b233"
              />
            </g>
            <g id="rightLeg">
              <polygon
                id="rtLeg"
                points="744.04 1081.44 766.21 1081.94 600.78 796.01 584.54 805.39 744.04 1081.44"
                fill="#878787"
              />
              <path
                id="rtFoot"
                d="M769.12,1078.95a4.14,4.14,0,0,1-4.14,4.14h-21.9a4.14,4.14,0,0,1-4.14-4.14h0a4.14,4.14,0,0,1,4.14-4.14H765a4.14,4.14,0,0,1,4.14,4.14h0Z"
                fill="#f9b233"
              />
            </g>
          </g>

          <rect id="screen" x="213.04" y="168.42" width="774.93" height="552.7" fill="#fff" />
          <rect id="centerShadowBottom" x="589.08" y="744.16" width="18.16" height="18.61" fill="#575756" />

          <g id="screenBars">
            <g id="screenTop">
              <rect id="topCore" x="168.78" y="154.36" width="863.43" height="17.97" rx="4" ry="4" fill="#c6c6c6" />
              <rect id="topBar" x="180.57" y="148.21" width="839.87" height="30.3" rx="8" ry="8" fill="#4c4c4c" />
              <rect id="topHighlight" x="188.62" y="166.93" width="825.31" height="6.14" fill="#fff" opacity="0.2" />
            </g>
            <g id="screenBottom">
              <rect id="bottomCore" x="168.78" y="722.05" width="863.43" height="17.97" rx="4" ry="4" fill="#c6c6c6" />
              <rect id="bottomBar" x="180.57" y="715.34" width="839.87" height="34.63" rx="8" ry="8" fill="#4c4c4c" />
              <rect id="bottomHighlight" x="187.28" y="722.54" width="825.31" height="6.14" fill="#fff" opacity="0.2" />
            </g>
          </g>
        </g>

        <g id="film" opacity="0">
          <rect width="700" height="500" x="250" y="200" rx="30" ry="30" opacity="0.65" fill="url(#filmGradient)" />

          <g mask="url(#filmMask)">
            <rect width="700" height="500" x="250" y="200" rx="30" ry="30" fill="url(#filmGradient)" />
          </g>

          <g strokeWidth="2">
            <circle cx="600" cy="450" r="175" stroke="#111" fill="none" />
            <circle cx="600" cy="450" r="150" stroke="#fff" fill="none" />
            <circle cx="600" cy="450" r="110" stroke="#fff" fill="none" />
            <line x1="350" y1="450" x2="850" y2="450" stroke="#111" />
            <line x1="600" y1="220" x2="600" y2="680" stroke="#111" />
          </g>

          <line id="rotator" x1="600" y1="275" x2="600" y2="450" stroke="#333" strokeWidth="3" />

          <text ref={counterRef} id="counter" textAnchor="middle" x="600" y="535" fontSize="250" />
        </g>
      </svg>
    </div>
  );
}
