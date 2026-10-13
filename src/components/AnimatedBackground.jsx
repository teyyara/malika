import React, { useEffect, useRef } from "react";

const stars = Array.from({ length: 24 }, (_, index) => ({
  id: index, left: ((index * 37 + 11) % 97) + "%",
  top: ((index * 29 + 7) % 91) + "%",
  delay: ((index * 13) % 9) / 3 + "s",
  size: index % 7 === 0 ? "4px" : "2px"
}));

const hearts = [
  { left: "9%", top: "28%", delay: "0s", size: "19px" },
  { left: "82%", top: "21%", delay: "2.4s", size: "15px" },
  { left: "89%", top: "72%", delay: "1.2s", size: "22px" },
  { left: "15%", top: "78%", delay: "3.1s", size: "13px" },
  { left: "69%", top: "83%", delay: "4s", size: "17px" }
];

export default function AnimatedBackground({ skyMood = "twilight", releasedWishes = [] }) {
  const worldRef = useRef(null);

  useEffect(() => {
    const world = worldRef.current;
    if (!world) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const root = document.documentElement;
    let frame = 0;
    function syncVisibility() {
      root.classList.toggle("is-tab-hidden", document.hidden);
      if (document.hidden && frame) { window.cancelAnimationFrame(frame); frame = 0; }
    }
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    if (reducedMotion.matches || coarsePointer.matches) {
      return () => {
        document.removeEventListener("visibilitychange", syncVisibility);
        root.classList.remove("is-tab-hidden");
      };
    }
    function followPointer(event) {
      if (event.pointerType === "touch") return;
      const x = Math.max(0, Math.min(1, event.clientX / window.innerWidth));
      const y = Math.max(0, Math.min(1, event.clientY / window.innerHeight));
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const horizontal = x - 0.5;
        const vertical = y - 0.5;
        world.style.setProperty("--parallax-x-slow", (horizontal * -13).toFixed(2) + "px");
        world.style.setProperty("--parallax-y-slow", (vertical * -10).toFixed(2) + "px");
        world.style.setProperty("--parallax-x-near", (horizontal * 23).toFixed(2) + "px");
        world.style.setProperty("--parallax-y-near", (vertical * 17).toFixed(2) + "px");
        world.style.setProperty("--pointer-shift-x", (horizontal * 16).toFixed(2) + "px");
        world.style.setProperty("--pointer-shift-y", (vertical * 12).toFixed(2) + "px");
      });
    }

    window.addEventListener("pointermove", followPointer, { passive: true });
    return () => {
      window.removeEventListener("pointermove", followPointer);
      document.removeEventListener("visibilitychange", syncVisibility);
      root.classList.remove("is-tab-hidden");
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={worldRef} className="ambient-world" data-sky-mood={skyMood} data-wish-count={releasedWishes.length} aria-hidden="true">
    <div className="ambient-glow ambient-glow-one" />
    <div className="ambient-glow ambient-glow-two" />
    <div className="star-layer">{stars.map((star) =>
      <i className="star" key={star.id} style={{
        left: star.left, top: star.top, animationDelay: star.delay,
        width: star.size, height: star.size
      }} />
    )}</div>
    <div className="floating-heart-layer">{hearts.map((heart, index) =>
      <span key={index} className="ambient-heart" style={{
        left: heart.left, top: heart.top, animationDelay: heart.delay,
        fontSize: heart.size
      }}>♥</span>
    )}</div>
    <div className="horizon-haze" />
    <div className="sky-wish-layer">{releasedWishes.slice(-12).map((wish) => <i className="sky-wish-trail" key={wish.id} style={{ left: wish.left + "%", top: wish.top + "%", "--wish-delay": wish.delay }} />)}</div>
  </div>;
}
