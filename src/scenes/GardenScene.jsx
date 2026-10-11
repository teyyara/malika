import React, { useState } from "react";
import CatCharacter from "../components/CatCharacter.jsx";
import Ladybug from "../components/Ladybug.jsx";
import { loveMessages } from "../data/loveMessages.js";
import { memories } from "../data/memories.js";

const greetings = [
  "Mimi says: you deserve a day full of soft things and happy surprises.",
  "Prrr… official kitten reminder: please be kind to yourself today.",
  "A tiny paw wave, delivered with an unreasonable amount of affection.",
  "Mimi has inspected the garden. It finds you absolutely wonderful.",
  "Breaking news: a small cat would like you to take a cozy little break."
];
const bugs = [
  { id: "reason-01", label: "A little thought" },
  { id: "adore-02", label: "A compliment" },
  { id: "wish-03", label: "A birthday wish" },
  { id: "reason-06", label: "A gentle reminder" }
];

export default function GardenScene({ discoveredCount, requiredHearts, onOpenNote, onGoToGame, onGoToCollection, onOpenLetter }) {
  const [catMessage, setCatMessage] = useState("");
  const [greetingIndex, setGreetingIndex] = useState(-1);
  const noteCount = loveMessages.length + memories.length;
  function greetCat() {
    const next = (greetingIndex + 1) % greetings.length;
    setGreetingIndex(next);
    setCatMessage(greetings[next]);
  }
  return <section className="garden-scene scene-pane" aria-labelledby="garden-heading">
    <div className="scene-heading garden-heading">
      <p className="eyebrow">✦ the little lavender garden</p>
      <h1 id="garden-heading">A garden full of little things <em>just for you.</em></h1>
      <p>Wander slowly. Tap a ladybug, say hello to Mimi, and find a few little reminders waiting among the flowers.</p>
    </div>
    <div className="garden-landscape">
      <div className="garden-halo" aria-hidden="true" /><div className="garden-star garden-star-a" aria-hidden="true">✧</div><div className="garden-star garden-star-b" aria-hidden="true">✦</div><div className="garden-star garden-star-c" aria-hidden="true">✧</div>
      <div className="garden-ground" aria-hidden="true" /><div className="garden-plant plant-left" aria-hidden="true"><i /><i /><i /><b /></div><div className="garden-plant plant-right" aria-hidden="true"><i /><i /><i /><b /></div>
      <div className="garden-cat-wrap"><CatCharacter mood="curious" onClick={greetCat} label="Say hello to Mimi the kitten" /></div>
      {bugs.map((bug, index) => <div className={"garden-bug garden-bug-" + (index + 1)} key={bug.id}><Ladybug label={"Reveal: " + bug.label} onClick={() => onOpenNote(bug.id)} /></div>)}
      <div className="garden-heart garden-heart-one" aria-hidden="true">♥</div><div className="garden-heart garden-heart-two" aria-hidden="true">♥</div><div className="garden-signature">little wonders live here</div>
    </div>
    <div className="garden-interaction-row">
      <div className="cat-reply" aria-live="polite"><span className="reply-sparkle" aria-hidden="true">✦</span><span>{catMessage || "Mimi is here, keeping a tiny eye on the stars."}</span></div>
      <div className="discovery-counter"><span aria-hidden="true">♡</span> {discoveredCount} / {noteCount} little notes discovered</div>
    </div>
    <div className="garden-destinations">
      <button className="destination-link destination-game" type="button" onClick={onGoToGame}><span className="destination-icon" aria-hidden="true">♥</span><span><strong>Mimi's heart garden</strong><small>Help her find {requiredHearts} little hearts</small></span><span className="destination-arrow" aria-hidden="true">↗</span></button>
      <button className="destination-link" type="button" onClick={onGoToCollection}><span className="destination-icon destination-icon-note" aria-hidden="true">✉</span><span><strong>The love collection</strong><small>Collect tiny notes and secret letters</small></span><span className="destination-arrow" aria-hidden="true">↗</span></button>
      <button className="destination-link" type="button" onClick={onOpenLetter}><span className="destination-icon destination-icon-letter" aria-hidden="true">♡</span><span><strong>A letter for your day</strong><small>There is something waiting inside</small></span><span className="destination-arrow" aria-hidden="true">↗</span></button>
    </div>
  </section>;
}
