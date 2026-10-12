import React from "react";
import { motion, useReducedMotion } from "motion/react";
import CatCharacter from "../components/CatCharacter.jsx";
import Ladybug from "../components/Ladybug.jsx";
import { siteConfig } from "../data/siteConfig.js";

const celebrationGlyphs = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  glyph: ["✦", "♥", "✧", "✿", "♡", "·"][index % 6],
  left: ((index * 41 + 7) % 94) + "%",
  top: ((index * 23 + 3) % 78) + "%",
  delay: ((index * 7) % 15) * 0.045,
  drift: ((index % 5) - 2) * 24,
  rotate: (index % 2 === 0 ? 1 : -1) * (35 + (index % 4) * 22)
}));

function HeartGlyph() {
  return <svg viewBox="0 0 32 30" aria-hidden="true"><path d="M16 27S2 18 2 9C2 2 11 0 16 7C21 0 30 2 30 9C30 18 16 27 16 27Z" fill="currentColor" /></svg>;
}

function VictoryField() {
  return <div className="celebration-field" aria-hidden="true">
    {celebrationGlyphs.map((particle) =>
      <motion.span key={particle.id} className="celebration-particle"
        style={{ left: particle.left, top: particle.top }}
        initial={{ opacity: 0, y: 18, scale: 0.35, rotate: 0 }}
        animate={{ opacity: [0, 0.95, 0], y: [18, -110 - particle.id % 5 * 9], x: [0, particle.drift], scale: [0.35, 1, 0.65], rotate: [0, particle.rotate] }}
        transition={{ duration: 1.5 + (particle.id % 4) * 0.22, delay: particle.delay, ease: "easeOut" }}>
        {particle.glyph}
      </motion.span>
    )}
  </div>;
}

export default function HeartGardenScene({ game, onGameAction, onBonusNote, onGoToFinale, onGoToGarden }) {
  const reduceMotion = useReducedMotion();
  const progress = Math.min(100, (game.count / game.requiredHearts) * 100);

  function collect(item) {
    if (item.type === "ladybug") onBonusNote(item.messageId || "wish-02");
    onGameAction({ type: "COLLECT", id: item.id });
  }

  return <section className="game-scene scene-pane" aria-labelledby="game-heading">
    <div className="scene-heading">
      <p className="eyebrow">✦ a tiny side quest</p>
      <h1 id="game-heading">{siteConfig.gameName}</h1>
      <p>Mimi has a tiny problem: {game.requiredHearts} purple hearts are hiding in the garden. Help her find them, one gentle tap at a time.</p>
    </div>
    {game.status === "ready" && <div className="game-ready">
      <div className="game-ready-cat"><span className="ready-star" aria-hidden="true">✦</span><HeartGlyph /><span className="ready-paw" aria-hidden="true">♡</span></div>
      <p className="game-instruction">No timer, no pressure. Just {game.requiredHearts} little hearts and a surprise at the end.</p>
      <button className="button button-primary" type="button" onClick={() => onGameAction({ type: "START" })}>Let's find some hearts <span aria-hidden="true">♡</span></button>
      <button className="text-button" type="button" onClick={onGoToGarden}>Back to the garden</button>
    </div>}
    {game.status === "playing" && <>
      <div className="game-status-row">
        <div className="game-progress-copy"><span className="eyebrow">hearts found</span><strong><span aria-live="polite" aria-atomic="true">{game.count}</span><i> / {game.requiredHearts}</i></strong></div>
        <div className="progress-track" role="progressbar" aria-label="Heart collection progress" aria-valuemin={0} aria-valuemax={game.requiredHearts} aria-valuenow={game.count}><span style={{ width: progress + "%" }} /></div>
        <span className="game-status-hearts" aria-hidden="true">{Array.from({ length: game.requiredHearts }, (_, index) => <i className={index < game.count ? "heart-dot is-found" : "heart-dot"} key={index}>♥</i>)}</span>
      </div>
      <div className="game-arena" aria-label="Heart collection garden">
        <div className="arena-moon" aria-hidden="true" />
        <div className="arena-flowers arena-flowers-left" aria-hidden="true">✿</div>
        <div className="arena-flowers arena-flowers-right" aria-hidden="true">✿</div>
        <div className="arena-ground" aria-hidden="true" />
        <div className="arena-mimi">
          <CatCharacter mood={game.count >= 5 ? "happy" : game.count >= 2 ? "curious" : "sleepy"}
            onClick={() => onBonusNote("adore-02")} label="Pet Mimi for a secret compliment" />
          <span>Mimi</span>
        </div>
        {game.count > 0 && <motion.span key={game.count} className="game-progress-celebration" aria-hidden="true"
          initial={{ opacity: 0, y: 12, scale: 0.8 }} animate={{ opacity: [0, 1, 0], y: [12, -18, -36], scale: [0.8, 1.1, 0.9] }}
          transition={{ duration: reduceMotion ? 0.01 : 0.95, ease: "easeOut" }}>+1 little heart</motion.span>}
        {game.collectibles.map((item) => item.type === "heart" ? <motion.button key={item.id} className="collectible-heart" type="button"
          style={{ left: item.x + "%", top: item.y + "%" }} aria-label={"Collect purple heart " + (game.count + 1)}
          onClick={() => collect(item)} whileTap={reduceMotion ? undefined : { scale: 0.72, rotate: -12 }}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={reduceMotion ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1, y: [0, -5, 0] }}
          transition={{ scale: { type: "spring", stiffness: 360, damping: 18 }, opacity: { duration: 0.2 }, y: { duration: 2.6 + (item.x % 3) / 2, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" } }}>
          <HeartGlyph /><span className="heart-sheen" aria-hidden="true" />
        </motion.button> : <div key={item.id} className="game-bonus-bug" style={{ left: item.x + "%", top: item.y + "%" }}>
          <Ladybug label="Tap the bonus ladybug for a little note" onClick={() => collect(item)} />
        </div>)}
      </div>
      <p className="game-footnote">Tip: Mimi has her own secret compliment. The ladybug has a bonus note. Neither will take a heart away.</p>
      <div className="game-controls"><button className="text-button" type="button" onClick={() => onGameAction({ type: "RESTART" })}>Start over</button><button className="text-button" type="button" onClick={onGoToGarden}>Pause and wander away</button></div>
    </>}
    {game.status === "won" && <motion.div className="game-won"
      initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.94, y: reduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.72, type: "spring", stiffness: 140, damping: 18 }}>
      <VictoryField />
      <div className="victory-sparkles" aria-hidden="true">✦　♥　✧　♥　✦</div>
      <div className="victory-cat"><span className="victory-halo" /><CatCharacter mood="happy" /></div>
      <p className="eyebrow">every last heart found</p><h2>You found every heart…</h2>
      <p>Here's a secret: all of them were yours from the very beginning. Now a few more little letters have appeared just for you. 💜</p>
      <button className="button button-primary" type="button" onClick={onGoToFinale}>Open your special gift <span aria-hidden="true">↗</span></button>
      <button className="text-button" type="button" onClick={() => onGameAction({ type: "RESTART" })}>Play again</button>
    </motion.div>}
  </section>;
}
