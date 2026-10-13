import React, { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import CatCharacter from "./CatCharacter.jsx";
import Ladybug from "./Ladybug.jsx";
import { storybookChapters } from "../data/mimisStorybook.js";
import { playCuteSound } from "../audio/soundEffects.js";

const initialChoices = () => [null, null, null];

export default function MimisStorybook() {
  const [phase, setPhase] = useState("intro");
  const [chapterIndex, setChapterIndex] = useState(0);
  const [choices, setChoices] = useState(initialChoices);
  const [petNote, setPetNote] = useState("");
  const reduceMotion = useReducedMotion();
  const chapter = storybookChapters[chapterIndex];
  const selection = choices[chapterIndex];
  const selectedOption = chapter.choices.find((choice) => choice.id === selection) || null;
  const completedCount = choices.filter(Boolean).length;
  const selectedPath = storybookChapters.map((item, index) =>
    item.choices.find((choice) => choice.id === choices[index])
  );
  const finalGift = selectedPath[2];

  function chooseOption(id) {
    if (selection !== id) playCuteSound("collect");
    setChoices((current) => current.map((value, index) => {
      if (index === chapterIndex) return id;
      if (index > chapterIndex) return null;
      return value;
    }));
  }

  function goForward() {
    if (!selection) return;
    if (chapterIndex < storybookChapters.length - 1) {
      playCuteSound("note");
      setChapterIndex((current) => current + 1);
    } else {
      playCuteSound("reward");
      setPhase("ending");
    }
  }

  function goBack() {
    if (chapterIndex > 0) {
      playCuteSound("tease");
      setChapterIndex((current) => current - 1);
    }
  }

  function beginAgain() {
    playCuteSound("on");
    setChoices(initialChoices());
    setChapterIndex(0);
    setPhase("intro");
    setPetNote("");
  }

  return <div className="mimi-storybook-layout" data-storybook-phase={phase} data-storybook-chapter={chapterIndex + 1}>
    <div className={"mimi-storybook-stage" + (phase === "ending" ? " is-story-complete" : "")}
      data-story-phase={phase} data-story-chapter={chapterIndex + 1}>
      <div className="mimi-storybook-moon" aria-hidden="true">☾</div>
      <span className="mimi-storybook-star mimi-storybook-star-one" aria-hidden="true">✦</span>
      <span className="mimi-storybook-star mimi-storybook-star-two" aria-hidden="true">✧</span>
      <span className="mimi-storybook-orbit mimi-storybook-orbit-one" aria-hidden="true" />
      <span className="mimi-storybook-orbit mimi-storybook-orbit-two" aria-hidden="true" />
      <div className="mimi-storybook-cat"><CatCharacter mood={phase === "ending" ? "happy" : chapterIndex === 1 ? "curious" : "love"} label="Pet Mimi while reading her storybook" onClick={() => setPetNote("Mimi slow-blinks, then nudges the envelope with one tiny paw. ♡")} /></div>
      <div className="mimi-storybook-ladybug" aria-hidden="true"><Ladybug decorative /></div>
      <p className="mimi-storybook-stage-caption">{phase === "ending" ? "a story made from your choices" : "Mimi, official storybook explorer"}</p>
    </div>

    <div className="mimi-storybook-copy">
      {petNote && <p className="mimi-storybook-pet-note" role="status" aria-live="polite">{petNote}</p>}
      <p className="companion-kicker"><span aria-hidden="true">✧</span> a choose-your-own tiny fairytale</p>
      <motion.div
        key={phase === "choices" ? "chapter-" + chapterIndex : phase}
        className={"mimi-storybook-page mimi-storybook-page-" + phase}
        initial={reduceMotion ? false : { opacity: 0, x: 12, rotateY: -1.2 }}
        animate={{ opacity: 1, x: 0, rotateY: 0 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.24, ease: "easeOut" }}
      >
      {phase === "intro" && <>
        <h3>One tiny story. Three little choices.</h3>
        <p className="mimi-storybook-description">Mimi has found an envelope for Malika, but the path and the surprise are yours to choose. Pick the details, then see what sort of ending the little night will make.</p>
        <p className="mimi-storybook-note">This is a made-up little fairytale for play—not a memory of something that happened.</p>
        <button type="button" className="mimi-storybook-primary" onClick={() => { playCuteSound("note"); setPhase("choices"); }}>Begin Mimi's story <span aria-hidden="true">↗</span></button>
      </>}

      {phase === "choices" && <>
        <div className="mimi-storybook-progress-line">
          <span>{chapter.kicker}</span>
          <span>Chapter {chapterIndex + 1} of {storybookChapters.length}</span>
        </div>
        <div className="mimi-storybook-progress" role="progressbar" aria-label="Story choices completed" aria-valuemin={0} aria-valuemax={storybookChapters.length} aria-valuenow={completedCount} aria-valuetext={completedCount + " of " + storybookChapters.length + " choices made"}>
          <span style={{ width: (completedCount / storybookChapters.length * 100) + "%" }} />
        </div>
        <h3>{chapter.title}</h3>
        <p className="mimi-storybook-description">{chapter.question}</p>
        <div className="mimi-storybook-options" role="group" aria-label={chapter.title}>
          {chapter.choices.map((choice, index) => <button key={choice.id} type="button"
            className={"mimi-storybook-choice" + (selection === choice.id ? " is-selected" : "")}
            aria-pressed={selection === choice.id}
            onClick={() => chooseOption(choice.id)}>
            <span className="mimi-storybook-choice-number" aria-hidden="true">0{index + 1}</span>
            <span className="mimi-storybook-choice-copy"><strong>{choice.label}</strong><small>{choice.detail}</small></span>
            <span className="mimi-storybook-choice-mark" aria-hidden="true">{selection === choice.id ? "✓" : "＋"}</span>
          </button>)}
        </div>
        <div className="mimi-storybook-controls">
          <button type="button" className="mimi-storybook-secondary" disabled={chapterIndex === 0} onClick={goBack}><span aria-hidden="true">←</span> Previous chapter</button>
          <button type="button" className="mimi-storybook-primary" disabled={!selection} onClick={goForward}>
            {chapterIndex === storybookChapters.length - 1 ? "Reveal our ending" : "Turn the tiny page"} <span aria-hidden="true">→</span>
          </button>
        </div>
      </>}

      {phase === "ending" && finalGift && <>
        <p className="mimi-storybook-ending-kicker">THE LITTLE NIGHT ENDS HERE</p>
        <h3>A story shaped by you.</h3>
        <article className="mimi-storybook-ending" aria-labelledby="mimi-storybook-ending-heading">
          <h4 id="mimi-storybook-ending-heading">Mimi's tiny fairytale for Malika</h4>
          {selectedPath.map((choice, index) => <motion.p key={storybookChapters[index].id}
            initial={reduceMotion ? false : { opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.22, delay: reduceMotion ? 0 : index * 0.09 }}>
            {choice.passage}
          </motion.p>)}
          <motion.p className="mimi-storybook-last-line"
            initial={reduceMotion ? false : { opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.24, delay: reduceMotion ? 0 : 0.32 }}>
            {finalGift.ending}
          </motion.p>
          <p className="mimi-storybook-signoff">And somewhere in the moonlit garden, Mimi curled up beside the now-empty envelope, already dreaming of the next little adventure. ♡</p>
        </article>
        <button type="button" className="mimi-storybook-primary mimi-storybook-restart" onClick={beginAgain}>Tell another tiny story <span aria-hidden="true">↻</span></button>
      </>}
      </motion.div>
    </div>
  </div>;
}
