import React from "react";
import { motion } from "motion/react";
import CatCharacter from "../components/CatCharacter.jsx";
import Ladybug from "../components/Ladybug.jsx";
import { siteConfig } from "../data/siteConfig.js";

export default function WelcomeScene({ onEnter }) {
  return <section className="welcome-scene scene-pane" aria-labelledby="welcome-heading">
    <div className="welcome-orbit welcome-orbit-one" aria-hidden="true" />
    <div className="welcome-orbit welcome-orbit-two" aria-hidden="true" />
    <motion.div className="welcome-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.82, ease: [0.2, 0.75, 0.2, 1] }}>
      <p className="eyebrow"><span aria-hidden="true">✦</span> a birthday made of little wonders</p>
      <p className="birthday-date">{siteConfig.birthdayDateLabel}</p>
      <h1 id="welcome-heading">{siteConfig.welcomeMessage}</h1>
      <p className="welcome-description">A moonlit garden of purple hearts, sleepy cats, tiny ladybugs, and little surprises — made for the loveliest birthday girl.</p>
      <button className="button button-primary welcome-cta" type="button" onClick={onEnter}>Open your birthday surprise <span aria-hidden="true">💜</span></button>
      <p className="micro-copy">{siteConfig.welcomeByline} <span aria-hidden="true">·</span> Mimi likes a gentle hello.</p>
    </motion.div>
    <motion.div className="welcome-character" initial={{ opacity: 0, scale: 0.94, rotate: 1 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1.05, delay: 0.12, ease: [0.2, 0.75, 0.2, 1] }}>
      <div className="welcome-moon" aria-hidden="true" />
      <div className="welcome-flower" aria-hidden="true"><i /><i /><i /><i /><b /></div>
      <CatCharacter mood="curious" onClick={() => {}} label="Pet Mimi to wake her up" />
      <div className="welcome-bug" aria-hidden="true"><Ladybug decorative /></div>
    </motion.div>
    <p className="welcome-bottom-note" aria-hidden="true">a whole little universe, just for you ♡</p>
  </section>;
}
