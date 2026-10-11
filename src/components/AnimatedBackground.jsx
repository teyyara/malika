import React from "react";

const stars = Array.from({ length: 32 }, (_, index) => ({
  id: index, left: ((index * 37 + 11) % 97) + "%", top: ((index * 29 + 7) % 91) + "%",
  delay: ((index * 13) % 9) / 3 + "s", size: index % 7 === 0 ? "4px" : "2px"
}));
const hearts = [
  { left: "9%", top: "28%", delay: "0s", size: "19px" },
  { left: "82%", top: "21%", delay: "2.4s", size: "15px" },
  { left: "89%", top: "72%", delay: "1.2s", size: "22px" },
  { left: "15%", top: "78%", delay: "3.1s", size: "13px" },
  { left: "69%", top: "83%", delay: "4s", size: "17px" }
];

export default function AnimatedBackground() {
  return <div className="ambient-world" aria-hidden="true">
    <div className="ambient-glow ambient-glow-one" /><div className="ambient-glow ambient-glow-two" />
    <div className="star-layer">{stars.map((star) => <i className="star" key={star.id} style={{ left: star.left, top: star.top, animationDelay: star.delay, width: star.size, height: star.size }} />)}</div>
    <div className="floating-heart-layer">{hearts.map((heart, index) => <span key={index} className="ambient-heart" style={{ left: heart.left, top: heart.top, animationDelay: heart.delay, fontSize: heart.size }}>♥</span>)}</div>
    <div className="horizon-haze" />
  </div>;
}
