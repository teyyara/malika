import React from "react";
import { motion } from "motion/react";
import CatCharacter from "../components/CatCharacter.jsx";
import Ladybug from "../components/Ladybug.jsx";
import { siteConfig } from "../data/siteConfig.js";

export default function WelcomeScene({ onEnter }) {
  return <section className="welcome-scene scene-pane" aria-labelledby="welcome-heading">
    <div className="welcome-orbit welcome-orbit-one" aria-hidden="true" />
    <div className="welcome-orbit welcome-orbit-two" aria-hidden="true" />
    <motion.div className="welcome-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
      <p className="eyebrow"><span aria-hidden="true">✦</span> a birthday made of little wonders</p>
      <h1 id="welcome-heading">{siteConfig.welcomeMessage}</h1>
      <p className="welcome-description">A soft little world of purple hearts, tiny discoveries, and all the sweetness this day deserves.</p>
      <button className="button button-primary welcome-cta" type="button" onClick={onEnter}>Open your birthday surprise <span aria-hidden="true">↗</span></button>
      <p className="micro-copy">made with care, one little surprise at a time</p>
    </motion.div>
    <div className="welcome-character" aria-hidden="true">
      <div className="welcome-moon" /><div className="welcome-flower"><i /><i /><i /><i /><b /></div>
      <CatCharacter mood="curious" /><div className="welcome-bug"><Ladybug decorative /></div>
    </div>
    <p className="welcome-bottom-note" aria-hidden="true">follow the little lights ♡</p>
  </section>;
}
