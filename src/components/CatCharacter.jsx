import React, { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const reactions = ["idle", "curious", "delighted", "sleepy", "love", "surprised"];

export default function CatCharacter({ mood = "curious", onClick, label = "A little lavender kitten" }) {
  const reduceMotion = useReducedMotion();
  const [reactionIndex, setReactionIndex] = useState(0);
  const reaction = reactions[reactionIndex];

  let animation;
  let duration = 3.7;
  let repeat = Infinity;
  if (reduceMotion) {
    animation = { y: 0, rotate: 0, scale: 1 };
    duration = 0.01;
    repeat = 0;
  } else if (reaction === "delighted") {
    animation = { y: [0, -12, -4, -15, 0], rotate: [0, -5, 6, -3, 0], scale: [1, 1.035, 1] };
    duration = 0.86;
    repeat = 0;
  } else if (reaction === "surprised") {
    animation = { y: [0, -5, 0], scale: [1, 1.08, 1], rotate: [0, 2, -2, 0] };
    duration = 0.62;
    repeat = 0;
  } else if (reaction === "sleepy") {
    animation = { y: [0, 1, 0], rotate: [0, -1, 0] };
    duration = 1.35;
    repeat = 0;
  } else if (reaction === "love") {
    animation = { y: [0, -8, 0], rotate: [0, -3, 3, 0], scale: [1, 1.025, 1] };
    duration = 1.05;
    repeat = 0;
  } else if (reaction === "curious") {
    animation = { y: [0, -4, 0], rotate: [0, -2, 2, 0] };
    duration = 0.72;
    repeat = 0;
  } else {
    animation = mood === "happy" ? { y: [0, -7, 0], rotate: [0, -2, 2, 0] } : { y: [0, -3, 0] };
    duration = mood === "happy" ? 0.8 : 3.7;
    repeat = mood === "happy" ? 0 : Infinity;
  }

  function reactToPet() {
    setReactionIndex((current) => (current + 1) % reactions.length);
    onClick?.();
  }

  function followPointer(event) {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const gazeX = Math.max(-1.35, Math.min(1.35, ((event.clientX - rect.left) / rect.width - 0.5) * 2.7));
    const gazeY = Math.max(-1.1, Math.min(1.1, ((event.clientY - rect.top) / rect.height - 0.5) * 2.2));
    event.currentTarget.style.setProperty("--gaze-x", gazeX.toFixed(2) + "px");
    event.currentTarget.style.setProperty("--gaze-y", gazeY.toFixed(2) + "px");
  }

  const art = <motion.svg className={"cat-art cat-art-" + mood + " cat-reaction-" + reaction}
    viewBox="0 0 240 220" aria-hidden="true" initial={false} animate={animation}
    transition={{ duration, repeat, ease: "easeInOut" }}>
    <ellipse cx="122" cy="196" rx="68" ry="12" fill="#090515" opacity=".4" />
    <path className="cat-tail" d="M164 157 C208 162 211 127 192 120 C178 114 171 128 183 132" fill="none" stroke="#cbb4ef" strokeWidth="16" strokeLinecap="round" />
    <ellipse cx="122" cy="164" rx="40" ry="27" fill="#faf4ff" opacity=".92" />
    <ellipse cx="102" cy="183" rx="16" ry="12" fill="#d9c9ef" stroke="#8d70be" strokeWidth="2" /><ellipse cx="143" cy="183" rx="16" ry="12" fill="#d9c9ef" stroke="#8d70be" strokeWidth="2" />
    <g className="cat-head">
      <path className="cat-ear cat-ear-left" d="M72 90 L64 35 Q63 22 76 34 L105 58 Z" fill="#d9c9ef" stroke="#8d70be" strokeWidth="3" strokeLinejoin="round" />
      <path className="cat-ear cat-ear-right" d="M142 58 L171 32 Q184 23 181 42 L172 91 Z" fill="#d9c9ef" stroke="#8d70be" strokeWidth="3" strokeLinejoin="round" />
      <path d="M73 82 L73 49 L94 65 Z" fill="#f6a8d1" /><path d="M153 65 L174 45 L168 83 Z" fill="#f6a8d1" />
      <ellipse cx="121" cy="128" rx="67" ry="59" fill="#e9dff9" stroke="#8d70be" strokeWidth="3" />
      <path d="M100 69 Q120 57 140 69" fill="none" stroke="#b7a2d8" strokeWidth="3" strokeLinecap="round" />
      <g className="cat-eyes">
        <g className="cat-eye cat-eye-left"><ellipse className="cat-pupil" cx="95" cy="119" rx="10" ry="15" fill="#3b2a59" /><circle className="cat-highlight" cx="92" cy="114" r="3.3" fill="#fff" /></g>
        <g className="cat-eye cat-eye-right"><ellipse className="cat-pupil" cx="146" cy="119" rx="10" ry="15" fill="#3b2a59" /><circle className="cat-highlight" cx="143" cy="114" r="3.3" fill="#fff" /></g>
      </g>
      <ellipse className="cat-cheek" cx="84" cy="140" rx="12" ry="7" fill="#f7a8cf" opacity=".72" /><ellipse className="cat-cheek" cx="157" cy="140" rx="12" ry="7" fill="#f7a8cf" opacity=".72" />
      <path className="cat-nose" d="M116 137 Q122 143 128 137 Q123 151 116 137" fill="#b76b9a" />
      <path className="cat-mouth" d="M122 147 Q114 157 106 149 M122 147 Q130 157 138 149" fill="none" stroke="#6f568c" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M84 143 L51 138 M85 149 L55 153 M158 143 L190 138 M157 149 L187 153" stroke="#a18abd" strokeWidth="2" strokeLinecap="round" />
    </g>
    <path d="M53 86 C43 76 46 62 58 58" fill="none" stroke="#f9c9e8" strokeWidth="3" strokeLinecap="round" opacity=".7" /><circle cx="184" cy="83" r="5" fill="#ffb7de" opacity=".8" />
  </motion.svg>;

  if (!onClick) return <div className="cat-character">{art}</div>;
  return <button className="cat-character cat-character-button" type="button" aria-label={label}
    onClick={reactToPet} onPointerMove={followPointer}
    onPointerLeave={(event) => { event.currentTarget.style.setProperty("--gaze-x", "0px"); event.currentTarget.style.setProperty("--gaze-y", "0px"); }}>
    {art}<span className="character-hint">tap for a hello</span>
  </button>;
}
