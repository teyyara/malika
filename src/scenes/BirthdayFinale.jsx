import React, { useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import CatCharacter from "../components/CatCharacter.jsx";
import Ladybug from "../components/Ladybug.jsx";
import { siteConfig } from "../data/siteConfig.js";

const skyMotes = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  glyph: ["✧", "·", "♡", "✦"][index % 4],
  left: ((index * 31 + 5) % 90) + "%",
  top: ((index * 23 + 9) % 82) + "%",
  drift: ((index % 5) - 2) * 13,
  delay: (index % 6) * 0.34
}));

const revealSparks = Array.from({ length: 32 }, (_, index) => ({
  id: index,
  glyph: ["♥", "✦", "✧", "♡"][index % 4],
  left: ((index * 29 + 7) % 92) + "%",
  delay: (index % 6) * 0.075,
  drift: ((index % 5) - 2) * 15
}));

export default function BirthdayFinale({ onGoToGarden, onGrandFinale, wishCount = 0 }) {
  const [extraSurprise, setExtraSurprise] = useState(false);
  const [sealSecretOpen, setSealSecretOpen] = useState(false);
  const sealTapCount = useRef(0);
  const sealTapStartedAt = useRef(0);
  const reduceMotion = useReducedMotion();
  const heading = "Happy birthday, " + siteConfig.recipientName + " 💜";

  function tapSeal() {
    if (sealSecretOpen) return;
    const now = Date.now();
    if (!sealTapCount.current || now - sealTapStartedAt.current > 7000) {
      sealTapCount.current = 0;
      sealTapStartedAt.current = now;
    }
    sealTapCount.current += 1;
    if (sealTapCount.current >= 3) {
      sealTapCount.current = 0;
      sealTapStartedAt.current = 0;
      setSealSecretOpen(true);
    }
  }

  return <section className="finale-scene scene-pane" aria-labelledby="finale-heading">
    <div className="finale-top-art" aria-hidden="true">
      <div className="finale-depth-field">
        <span className="finale-orbit finale-orbit-one" />
        <span className="finale-orbit finale-orbit-two" />
        <span className="finale-orbit finale-orbit-three" />
        <span className="finale-heart-light">♡</span>
      </div>
      {skyMotes.map((mote) =>
        <motion.span key={mote.id} className="finale-mote" style={{ left: mote.left, top: mote.top }}
          animate={reduceMotion ? { opacity: 0.45 } : { opacity: [0.18, 0.72, 0.18], y: [0, -10, 0], x: [0, mote.drift * 0.7, 0] }}
          transition={{ duration: 3.4 + (mote.id % 4) * 0.45, delay: reduceMotion ? 0 : mote.delay, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}>
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
      <motion.h1 id="finale-heading"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.34, delay: reduceMotion ? 0 : 0.04 }}>
        {heading}
      </motion.h1>
      <motion.div className="letter-card"
        initial={reduceMotion ? false : { opacity: 0, y: 14, rotateX: 4, scale: 0.992 }}
        animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.44, delay: reduceMotion ? 0 : 0.08, type: "spring", stiffness: 210, damping: 25 }}>
        <div className="letter-top">
          <motion.button type="button" className="letter-seal letter-seal-trigger"
            aria-label={sealSecretOpen ? "The wax seal's secret has been revealed" : "Tap the wax seal three times to uncover a final secret"}
            onClick={tapSeal}
            animate={reduceMotion ? { scale: 1 } : { scale: [1, 1.08, 1], rotate: [0, -7, 0] }}
            transition={{ duration: 3.8, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
            style={{ border: 0, padding: 0, appearance: "none" }}>♥</motion.button>
          <span>for you, with love</span><span className="letter-sprig" aria-hidden="true">✿</span>
          <span className="letter-postmark" aria-hidden="true">12 · X</span>
        </div>
        {siteConfig.birthdayLetter.map((paragraph, index) =>
          <motion.p key={index}
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 9 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.26, delay: reduceMotion ? 0 : 0.08 + index * 0.055, ease: "easeOut" }}>
            {paragraph}
          </motion.p>
        )}
        <div className="letter-signoff"><span>With all my heart,</span>
          <motion.strong initial={reduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0.01 : 0.28, delay: reduceMotion ? 0 : 0.38 }}>
            {siteConfig.senderName} ♡
          </motion.strong>
        </div>
      </motion.div>
      <AnimatePresence>
        {sealSecretOpen && <motion.div className="seal-secret-reveal" role="status" aria-live="polite"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -5, scale: 0.985 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.24, type: "spring", stiffness: 260, damping: 25 }}>
          <span className="seal-secret-glyph" aria-hidden="true">♥</span>
          <p className="eyebrow">a whisper behind the seal</p>
          <p>Three careful taps, and the little wax seal gives way. Zack tucked one more tiny reminder behind the letter: even after the last page, there is always one more reason to smile. Keep this little secret close. 💜</p>
        </motion.div>}
      </AnimatePresence>
      <button className="button button-primary finale-surprise-button" type="button" onClick={() => setExtraSurprise((value) => {
        const next = !value;
        onGrandFinale?.(next);
        return next;
      })}>
        {extraSurprise ? "Keep the little magic" : "One last little surprise…"} <span aria-hidden="true">✦</span>
      </button>
      <AnimatePresence>{extraSurprise && <motion.div className="extra-surprise is-universe-made-for-you"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.24, type: "spring", stiffness: 250, damping: 24 }}
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
        <div className="extra-surprise-portal" aria-hidden="true">
          <span className="extra-portal-ring extra-portal-ring-one" />
          <span className="extra-portal-ring extra-portal-ring-two" />
          <span className="extra-portal-ring extra-portal-ring-three" />
          <span className="extra-portal-heart">♥</span>
        </div>
        <div className="extra-surprise-lights" aria-hidden="true">♥　✦　♥　✧　♥</div>
        <p className="universe-finale-kicker">A UNIVERSE MADE FOR YOU</p>
        <h2 className="universe-finale-title">Look what your little world has become.</h2>
        <p>Every discovery brought another light into the sky. ${wishCount > 0 ? "You sent " + wishCount + (wishCount === 1 ? " wish" : " wishes") + " into the stars, and each one has a place here. " : ""}May the world always feel a little softer when you remember how much you deserve to be loved, celebrated, and surprised.</p>
        <div className="extra-surprise-friends"><CatCharacter mood="happy" /><Ladybug decorative /></div>
      </motion.div>}</AnimatePresence>
      <button className="text-button finale-back" type="button" onClick={onGoToGarden}>Wander back into the garden ↗</button>
    </div>
  </section>;
}
