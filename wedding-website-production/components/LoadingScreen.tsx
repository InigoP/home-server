"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Phase = "flicker" | "wipe" | "done";

export default function LoadingScreen() {
  const [phase, setPhase] = useState<Phase>("flicker");

  useEffect(() => {
    if (sessionStorage.getItem("introShown")) {
      setPhase("done");
      return;
    }
    sessionStorage.setItem("introShown", "1");

    const t1 = setTimeout(() => setPhase("wipe"), 850);
    const t2 = setTimeout(() => setPhase("done"), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Projector lamp flash on load */}
      <motion.div
        style={{ position: "absolute", inset: 0, background: "#fff", zIndex: 1 }}
        initial={{ opacity: 0.85 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: "easeIn" }}
      />

      {/* Left curtain panel */}
      <motion.div
        style={{
          position: "absolute",
          top: 0, left: 0, bottom: 0, right: "50%",
          background: "var(--black)",
          zIndex: 2,
        }}
        animate={
          phase === "wipe"
            ? { x: "-100%" }
            : { opacity: [1, 0.3, 1, 0.55, 1, 0.2, 1, 0.6, 1] }
        }
        transition={
          phase === "wipe"
            ? { duration: 0.9, ease: [0.76, 0, 0.24, 1] }
            : { duration: 0.8, ease: "linear" }
        }
      />

      {/* Right curtain panel */}
      <motion.div
        style={{
          position: "absolute",
          top: 0, right: 0, bottom: 0, left: "50%",
          background: "var(--black)",
          zIndex: 2,
        }}
        animate={
          phase === "wipe"
            ? { x: "100%" }
            : { opacity: [1, 0.3, 1, 0.55, 1, 0.2, 1, 0.6, 1] }
        }
        transition={
          phase === "wipe"
            ? { duration: 0.9, ease: [0.76, 0, 0.24, 1] }
            : { duration: 0.8, ease: "linear" }
        }
      />
    </div>
  );
}
