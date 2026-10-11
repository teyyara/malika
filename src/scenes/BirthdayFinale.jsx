import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import CatCharacter from "../components/CatCharacter.jsx";
import Ladybug from "../components/Ladybug.jsx";
import { siteConfig } from "../data/siteConfig.js";

export default function BirthdayFinale({ onGoToGarden }) {
  const [extraSurprise, setExtraSurprise] = useState(false);
  const heading = "Happy birthday, " + siteConfig.recipientName + " 💜";
  return <section className="finale-scene scene-pane" aria-labelledby="finale-heading">
    <div className="finale-top-art" aria-hidden="true">
      <span className="finale-star finale-star-one">✦</span><span className="finale-star finale-star-two">✧</span><span className="finale-star finale-star-three">✦</span><span className="finale-floating-heart finale-heart-one">♥</span><span className="finale-floating-heart finale-heart-two">♥</span>
      <div className="finale-cat"><CatCharacter mood="happy" /></div>
    </div>
    <div className="finale-letter-wrap">
      <p className="eyebrow">✦ the most important little thing</p><p className="finale-date">{siteConfig.birthdayDate} · a day for Malika</p>
      <h1 id="finale-heading">{heading}</h1>
      <div className="letter-card">
        <div className="letter-top"><span className="letter-seal" aria-hidden="true">♥</span><span>for you, with love</span><span className="letter-sprig" aria-hidden="true">✿</span></div>
        {siteConfig.birthdayLetter.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        <div className="letter-signoff"><span>With all my heart,</span><strong>{siteConfig.senderName} ♡</strong></div>
      </div>
      <button className="button button-primary finale-surprise-button" type="button" onClick={() => setExtraSurprise((value) => !value)}>{extraSurprise ? "Keep the little magic" : "One last little surprise…"} <span aria-hidden="true">✦</span></button>
      <AnimatePresence>{extraSurprise && <motion.div className="extra-surprise" initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }} role="status">
        <div className="extra-surprise-lights" aria-hidden="true">♥　✦　♥　✧　♥</div><p>May today hold a hundred little reasons to smile — and may you remember that you are worth celebrating long after the candles are gone.</p><div className="extra-surprise-friends"><CatCharacter mood="happy" /><Ladybug decorative /></div>
      </motion.div>}</AnimatePresence>
      <button className="text-button finale-back" type="button" onClick={onGoToGarden}>Wander back into the garden ↗</button>
    </div>
  </section>;
}
