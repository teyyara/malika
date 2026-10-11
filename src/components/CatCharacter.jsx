import React from "react";
import { motion, useReducedMotion } from "motion/react";

export default function CatCharacter({ mood = "curious", onClick, label = "A little lavender kitten" }) {
  const reduceMotion = useReducedMotion();
  const animation = reduceMotion ? undefined : (mood === "happy" ? { y: [0, -7, 0], rotate: [0, -2, 2, 0] } : { y: [0, -3, 0] });
  const art = <motion.svg className={"cat-art cat-art-" + mood} viewBox="0 0 240 220" aria-hidden="true" initial={false} animate={animation}
    transition={{ duration: mood === "happy" ? 0.8 : 3.7, repeat: mood === "happy" || reduceMotion ? 0 : Infinity, ease: "easeInOut" }}>
    <ellipse cx="122" cy="196" rx="68" ry="12" fill="#090515" opacity=".4" />
    <path className="cat-tail" d="M164 157 C208 162 211 127 192 120 C178 114 171 128 183 132" fill="none" stroke="#cbb4ef" strokeWidth="16" strokeLinecap="round" />
    <path d="M72 90 L64 35 Q63 22 76 34 L105 58 Z" fill="#d9c9ef" stroke="#8d70be" strokeWidth="3" strokeLinejoin="round" />
    <path d="M142 58 L171 32 Q184 23 181 42 L172 91 Z" fill="#d9c9ef" stroke="#8d70be" strokeWidth="3" strokeLinejoin="round" />
    <path d="M73 82 L73 49 L94 65 Z" fill="#f6a8d1" /><path d="M153 65 L174 45 L168 83 Z" fill="#f6a8d1" />
    <ellipse cx="121" cy="128" rx="67" ry="59" fill="#e9dff9" stroke="#8d70be" strokeWidth="3" />
    <ellipse cx="122" cy="164" rx="40" ry="27" fill="#faf4ff" opacity=".92" />
    <ellipse cx="95" cy="119" rx="10" ry="15" fill="#3b2a59" /><ellipse cx="146" cy="119" rx="10" ry="15" fill="#3b2a59" />
    <circle cx="92" cy="114" r="3.3" fill="#fff" /><circle cx="143" cy="114" r="3.3" fill="#fff" />
    <ellipse cx="84" cy="140" rx="12" ry="7" fill="#f7a8cf" opacity=".72" /><ellipse cx="157" cy="140" rx="12" ry="7" fill="#f7a8cf" opacity=".72" />
    <path d="M116 137 Q122 143 128 137 Q123 151 116 137" fill="#b76b9a" />
    <path d="M122 147 Q114 157 106 149 M122 147 Q130 157 138 149" fill="none" stroke="#6f568c" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M84 143 L51 138 M85 149 L55 153 M158 143 L190 138 M157 149 L187 153" stroke="#a18abd" strokeWidth="2" strokeLinecap="round" />
    <path d="M100 69 Q120 57 140 69" fill="none" stroke="#b7a2d8" strokeWidth="3" strokeLinecap="round" />
    <ellipse cx="102" cy="183" rx="16" ry="12" fill="#d9c9ef" stroke="#8d70be" strokeWidth="2" /><ellipse cx="143" cy="183" rx="16" ry="12" fill="#d9c9ef" stroke="#8d70be" strokeWidth="2" />
    <path d="M112 182 L112 186 M120 181 L120 186 M135 182 L135 186 M143 181 L143 186" stroke="#8d70be" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M53 86 C43 76 46 62 58 58" fill="none" stroke="#f9c9e8" strokeWidth="3" strokeLinecap="round" opacity=".7" /><circle cx="184" cy="83" r="5" fill="#ffb7de" opacity=".8" />
  </motion.svg>;
  if (!onClick) return <div className="cat-character">{art}</div>;
  return <button className="cat-character cat-character-button" type="button" aria-label={label} onClick={onClick}>{art}<span className="character-hint">tap for a hello</span></button>;
}
