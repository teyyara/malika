import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import CatCharacter from "../components/CatCharacter.jsx";
import Ladybug from "../components/Ladybug.jsx";
import { siteConfig } from "../data/siteConfig.js";

const skyMotes = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  glyph: ["✧", "·", "♡", "✦"][index % 4],
  left: ((index * 31 + 5) % 90) + "%",
  top: ((index * 23 + 9) % 82) + "%",
  drift: ((index % 5) - 2) * 13,
  delay: (index % 6) * 0.34
}));

const revealSparks = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  glyph: ["♥", "✦", "✧", "♡"][index % 4],
  left: ((index * 29 + 7) % 92) + "%",
  delay: (index % 6) * 0.075,
  drift: ((index % 5) - 2) * 15
}));

export default function BirthdayFinale({ onGoToGarden }) {
  const [extraSurprise, setExtraSurprise] = useState(false);
  const reduceMotion = useReducedMotion();
  const heading = "Happy birthday, " + siteConfig.recipientName + " 💜";

  return <section className="finale-scene scene-pane" aria-labelledby="finale-heading">
    <div className="finale-top-art" aria-hidden="true">
      {skyMotes.map((mote) =>
        <motion.span key={mote.id} className="finale-mote" style={{ left: mote.left, top: mote.top }}
          animate={reduceMotion ? { opacity: 0.5 } : { opacity: [0.14, 0.8, 0.18], y: [0, -13, 0], x: [0, mote.drift, 0], rotate: [0, mote.drift, 0] }}
          transition={{ duration: 4.1 + (mote.id % 4) * 0.7, delay: mote.delay, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}>
          {mote.glyph}
        </motion.span>
      )}
      <span className="finale-star finale-star-one">✦</span><span className="finale-star finale-star-two">✧</span><span className="finale-star finale-star-three">✦</span>
      <span className="finale-floating-heart finale-heart-one">♥</span><span className="finale-floating-heart finale-heart-two">♥</span>
      <div className="finale-cat"><CatCharacter mood="happy" /></div>
    </div>
    <div className="finale-letter-wrap">
      <p className="eyebrow">✦ the most important little thing</p>
      <p className="finale-date">{siteConfig.birthdayDate} · a day for Malika</p>
      <h1 id="finale-heading">{heading}</h1>
      <div className="letter-card">
        <div className="letter-top"><span className="letter-seal" aria-hidden="true">♥</span><span>for you, with love</span><span className="letter-sprig" aria-hidden="true">✿</span></div>
        {siteConfig.birthdayLetter.map((paragraph, index) =>
          <motion.p key={index}
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 9 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.56, delay: reduceMotion ? 0 : 0.12 + index * 0.19, ease: "easeOut" }}>
            {paragraph}
          </motion.p>
        )}
        <div className="letter-signoff"><span>With all my heart,</span>
          <motion.strong initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0.01 : 0.55, delay: reduceMotion ? 0 : 1.2 }}>
            {siteConfig.senderName} ♡
          </motion.strong>
        </div>
      </div>
      <button className="button button-primary finale-surprise-button" type="button" onClick={() => setExtraSurprise((value) => !value)}>
        {extraSurprise ? "Keep the little magic" : "One last little surprise…"} <span aria-hidden="true">✦</span>
      </button>
      <AnimatePresence>{extraSurprise && <motion.div className="extra-surprise"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.42, type: "spring", stiffness: 190, damping: 18 }}
        role="status">
        <div className="reveal-spark-field" aria-hidden="true">
          {revealSparks.map((spark) =>
            <motion.span key={spark.id} className="reveal-spark" style={{ left: spark.left }}
              initial={{ opacity: 0, y: 12, scale: 0.5 }}
              animate={reduceMotion ? { opacity: 0.65 } : { opacity: [0, 0.9, 0], y: [12, -40 - spark.id % 4 * 12], x: [0, spark.drift], scale: [0.5, 1, 0.65] }}
              transition={{ duration: reduceMotion ? 0.01 : 1.8, delay: reduceMotion ? 0 : spark.delay, ease: "easeOut" }}>
              {spark.glyph}
            </motion.span>
          )}
        </div>
        <div className="extra-surprise-lights" aria-hidden="true">♥　✦　♥　✧　♥</div>
        <p>May today hold a hundred little reasons to smile — and may you remember that you are worth celebrating long after the candles are gone.</p>
        <div className="extra-surprise-friends"><CatCharacter mood="happy" /><Ladybug decorative /></div>
      </motion.div>}</AnimatePresence>
      <button className="text-button finale-back" type="button" onClick={onGoToGarden}>Wander back into the garden ↗</button>
    </div>
  </section>;
}
