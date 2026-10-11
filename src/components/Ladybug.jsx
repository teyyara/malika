import React from "react";
import { motion } from "motion/react";

function LadybugArt() {
  return <svg viewBox="0 0 68 58" aria-hidden="true">
    <path d="M31 15 C23 7 12 14 17 22 L26 29" fill="#f8a9d2" opacity=".65" /><path d="M37 15 C48 7 58 14 52 23 L43 29" fill="#f8a9d2" opacity=".65" />
    <ellipse cx="34" cy="34" rx="22" ry="17" fill="#ff4d6d" stroke="#351a42" strokeWidth="2.8" /><path d="M34 18 L34 49" stroke="#351a42" strokeWidth="2.8" />
    <ellipse cx="34" cy="18" rx="10" ry="9" fill="#2c173c" />
    <circle cx="24" cy="29" r="3.7" fill="#2c173c" /><circle cx="43" cy="28" r="3.7" fill="#2c173c" /><circle cx="25" cy="40" r="3.7" fill="#2c173c" /><circle cx="44" cy="40" r="3.7" />
    <circle cx="31" cy="15" r="2.2" fill="#fff" opacity=".85" /><path d="M29 11 L24 5 M39 11 L44 5" stroke="#2c173c" strokeWidth="2" strokeLinecap="round" />
  </svg>;
}

export default function Ladybug({ onClick, label = "Discover a little love note", className = "", decorative = false }) {
  if (decorative) return <span className={"ladybug-button " + className} aria-hidden="true"><LadybugArt /></span>;
  return <motion.button type="button" className={"ladybug-button " + className} aria-label={label} onClick={onClick} whileTap={{ scale: 0.86, rotate: -8 }} whileHover={{ y: -3 }}><LadybugArt /></motion.button>;
}
