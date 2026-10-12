import React, { useCallback, useMemo, useReducer } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import EasterEggSystem from "../components/EasterEggSystem.jsx";
import LoveNoteModal from "../components/LoveNoteModal.jsx";
import WelcomeScene from "../scenes/WelcomeScene.jsx";
import GardenScene from "../scenes/GardenScene.jsx";
import HeartGardenScene from "../scenes/HeartGardenScene.jsx";
import LoveCollectionScene from "../scenes/LoveCollectionScene.jsx";
import BirthdayFinale from "../scenes/BirthdayFinale.jsx";
import { loveMessages } from "../data/loveMessages.js";
import { memories } from "../data/memories.js";
import { siteConfig } from "../data/siteConfig.js";
import { createInitialExperienceState, experienceReducer } from "./experienceReducer.js";

const allNotes = [...loveMessages, ...memories];
const nav = [{id:"garden",label:"The garden"},{id:"game",label:"Heart game"},{id:"collection",label:"Love notes"},{id:"finale",label:"Birthday letter"}];

export default function App() {
  const [state, dispatch] = useReducer(experienceReducer, null, () => createInitialExperienceState(siteConfig.requiredHearts));
  const reduceMotion = useReducedMotion();
  const activeMessage = useMemo(() => allNotes.find((item) => item.id === state.activeMessageId) || null, [state.activeMessageId]);
  const openNote = useCallback((id) => { if (allNotes.some((item) => item.id === id)) dispatch({type:"OPEN_NOTE",id}); }, []);
  const closeNote = useCallback(() => dispatch({type:"CLOSE_NOTE"}), []);
  const go = useCallback((scene) => dispatch({type:"NAVIGATE",scene}), []);
  const gameAction = useCallback((action) => dispatch({type:"GAME_ACTION",action}), []);

  let scene;
  if (state.scene === "garden") scene = <GardenScene discoveredCount={state.discoveredMessageIds.length} requiredHearts={state.game.requiredHearts} onOpenNote={openNote} onGoToGame={() => go("game")} onGoToCollection={() => go("collection")} onOpenLetter={() => go("finale")} />;
  else if (state.scene === "game") scene = <HeartGardenScene game={state.game} onGameAction={gameAction} onBonusNote={openNote} onGoToFinale={() => go("finale")} onGoToGarden={() => go("garden")} />;
  else if (state.scene === "collection") scene = <LoveCollectionScene gameWon={state.game.status === "won"} discoveredIds={state.discoveredMessageIds} onOpenNote={openNote} />;
  else if (state.scene === "finale") scene = <BirthdayFinale onGoToGarden={() => go("garden")} />;
  else scene = <WelcomeScene onEnter={() => go("garden")} />;

  return <div className={reduceMotion ? "app-shell prefers-less-motion" : "app-shell"}>
    <a className="skip-link" href="#main-content">Skip to the surprise</a>
    <AnimatedBackground />
    {state.scene !== "welcome" && <header className="site-header">
      <button className="brand-mark" type="button" onClick={() => go("garden")} aria-label="Return to Malika's birthday garden"><span className="brand-heart" aria-hidden="true">♥</span><span className="brand-copy"><strong>for Malika</strong><small>made with love by Zack</small></span></button>
      <nav className="scene-navigation" aria-label="Explore Malika's birthday universe">{nav.map((item) => <button key={item.id} type="button" className={state.scene === item.id ? "nav-link is-current" : "nav-link"} aria-current={state.scene === item.id ? "page" : undefined} onClick={() => go(item.id)}>{item.label}</button>)}</nav>
      <div className="header-heart-count" aria-label={"Hearts collected: " + state.game.count + " of " + state.game.requiredHearts}>♥ {state.game.count}/{state.game.requiredHearts}</div>
    </header>}
    <main id="main-content" className={state.scene === "welcome" ? "main-content is-welcome" : "main-content"}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div className={"scene-transition scene-transition-" + state.scene} key={state.scene}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.985, filter: "blur(7px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -9, scale: 0.995, filter: "blur(5px)" }}
          transition={{ duration: reduceMotion ? 0.12 : 0.46, ease: [0.22, 0.75, 0.22, 1] }}>
          {scene}
        </motion.div>
      </AnimatePresence>
    </main>
    {state.scene !== "welcome" && <footer className="site-footer"><span>a tiny birthday universe · made by Zack for Malika · 12 October</span><button className="footer-star-trigger" type="button" aria-label="Reveal the tiny footer star’s secret — click three times" title="A little secret is hiding here">✦</button></footer>}
    <LoveNoteModal message={activeMessage} onClose={closeNote} senderName={siteConfig.senderName} />
    <EasterEggSystem />
  </div>;
}
