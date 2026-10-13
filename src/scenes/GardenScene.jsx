import React, { useState } from "react";
import CatCharacter from "../components/CatCharacter.jsx";
import Ladybug from "../components/Ladybug.jsx";
import GardenCompanionStudio from "../components/GardenCompanionStudio.jsx";
import { loveMessages } from "../data/loveMessages.js";
import { memories } from "../data/memories.js";
import { playCuteSound } from "../audio/soundEffects.js";

const greetings = [
  "Mimi's official birthday announcement: Malika deserves all the soft things and happy surprises.",
  "Prrr… Zack asked me to remind you to be wonderfully kind to yourself today.",
  "A tiny paw wave for Malika, delivered with an unreasonable amount of affection.",
  "Mimi has inspected this garden. Verdict: its birthday girl is absolutely wonderful.",
  "Breaking news: one small cat has prescribed a cozy break and at least three smiles.",
  "Mimi has noticed how carefully you're exploring. She's saving her best purr for you.",
  "The stars are brighter now. Mimi suspects somebody lovely is making a wish."
];

const bugs = [
  { id: "reason-01", label: "A little thought" },
  { id: "adore-02", label: "A compliment" },
  { id: "wish-03", label: "A birthday wish" },
  { id: "reason-06", label: "A gentle reminder" }
];

const constellationStars = [
  "Trace the first star of a hidden birthday wish",
  "Trace the second star of a hidden birthday wish",
  "Trace the last star to reveal a secret wish"
];

const gardenMotes = Array.from({ length: 30 }, (_, index) => ({
  id: index,
  left: ((index * 37 + 11) % 96) + "%",
  top: ((index * 23 + 7) % 88) + "%",
  size: index % 6 === 0 ? "4px" : index % 3 === 0 ? "3px" : "2px",
  delay: -(((index * 7) % 19) / 3) + "s",
  duration: 5 + (index % 6) * 1.1 + "s"
}));

export default function GardenScene({ discoveredCount, heartsCollected = 0, requiredHearts, releasedWishes = [], onReleaseWish, onOpenNote, onGoToGame, onGoToCollection, onOpenLetter }) {
  const [catMessage, setCatMessage] = useState("");
  const [greetingIndex, setGreetingIndex] = useState(-1);
  const [constellationStep, setConstellationStep] = useState(0);
  const [constellationFound, setConstellationFound] = useState(false);
  const noteCount = loveMessages.length + memories.length;
  // A tiny visit-only reward: the flower grows as she explores the rest of the world.
  const blossomPoints = discoveredCount + heartsCollected + releasedWishes.length * 2;
  const blossomLevel = Math.min(5, Math.ceil(blossomPoints / 3));

  function tendLoveBlossom() {
    if (blossomLevel < 5) {
      setCatMessage(
        "Mimi checks the little flower with one careful paw: " + blossomLevel +
        " of 5 petals are awake. Discover notes, collect hearts, or send wishes to help it bloom."
      );
      return;
    }
    setCatMessage(
      "It opened! A tiny note from Zack: “I hope life leaves you a hundred little reasons to smile — " +
      "and that you remember one of mine is simply that you are you.” ♡"
    );
    playCuteSound("reveal");
  }

  function greetCat() {
    const next = (greetingIndex + 1) % greetings.length;
    setGreetingIndex(next);
    if (constellationFound) {
      setCatMessage("You found the wish hidden in the stars! Mimi would absolutely like credit for the discovery.");
    } else if (discoveredCount >= 10 && next % 2 === 0) {
      setCatMessage("You've found " + discoveredCount + " little notes already. Mimi has a feeling you haven't discovered everything yet…");
    } else {
      setCatMessage(greetings[next]);
    }
  }

  function traceStar(index) {
    if (constellationFound) {
      onOpenNote("wish-05");
      return;
    }
    if (index !== constellationStep) {
      setConstellationStep(index === 0 ? 1 : 0);
      setCatMessage(index === 0
        ? "Mimi saw that almost-shortcut. Fine, you can restart at the first twinkle—but she is absolutely keeping score."
        : "Caught you skipping ahead. Mimi taps the left curl with one tiny paw: follow the heart in order, detective.");
      return;
    }
    const nextStep = constellationStep + 1;
    setConstellationStep(nextStep);
    if (nextStep === constellationStars.length) {
      setConstellationFound(true);
      setCatMessage("The three stars made a heart just for you. A little wish was tucked inside.");
      onOpenNote("wish-05");
    }
  }

  return <section className="garden-scene scene-pane" aria-labelledby="garden-heading">
    <div className="scene-heading garden-heading">
      <p className="eyebrow">✦ a birthday garden, just for Malika</p>
      <h1 id="garden-heading">A garden full of little things <em>just for you.</em></h1>
      <p>Zack tucked tiny surprises between the stars. Wander slowly, tap a ladybug, say hello to Mimi, and let the garden give up its little secrets one by one. Mimi may pretend she did not notice your shortcuts. She is a terrible liar.</p>
    </div>
    <div className="garden-landscape">
      <div className="garden-sky-depth" aria-hidden="true">
        <span className="garden-orbit garden-orbit-one" />
        <span className="garden-orbit garden-orbit-two" />
        <span className="garden-orbit garden-orbit-three" />
        {gardenMotes.map((mote) =>
          <i key={mote.id} className="garden-mote" style={{
            left: mote.left, top: mote.top, width: mote.size, height: mote.size,
            "--mote-delay": mote.delay, "--mote-duration": mote.duration
          }} />
        )}
        <span className="garden-shooting-star garden-shooting-star-one">✦</span>
        <span className="garden-shooting-star garden-shooting-star-two">✧</span>
        <span className="garden-shooting-star garden-shooting-star-three">✦</span>
        <span className="garden-shooting-star garden-shooting-star-four">✧</span>
      </div>
      <div className="garden-halo" aria-hidden="true" />
      <svg className="garden-constellation-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path className={constellationStep >= 1 ? "is-lit" : ""} d="M21 17 C25 3 43 8 50 24" />
        <path className={constellationStep >= 2 ? "is-lit" : ""} d="M50 24 C57 8 75 3 79 17" />
        <path className={constellationFound ? "is-lit is-complete" : ""} d="M21 17 C10 34 37 54 50 61 C63 54 90 34 79 17" />
      </svg>
      {[0, 1, 2].map((index) =>
        <button key={index}
          className={"garden-star garden-star-" + ["a", "b", "c"][index] + " constellation-star constellation-star-" + ["a", "b", "c"][index] + (constellationFound ? " is-revealed" : index === constellationStep ? " is-next" : index < constellationStep ? " is-traced" : "")}
          type="button" aria-label={constellationFound ? "Open the wish from the heart constellation" : constellationStars[index]}
          aria-pressed={constellationFound || index < constellationStep}
          onClick={() => traceStar(index)}>
          {constellationFound || index < constellationStep ? "✦" : "✧"}
        </button>
      )}
      <div className="garden-ground" aria-hidden="true" />
      <div className="garden-plant plant-left" aria-hidden="true"><i /><i /><i /><b /></div>
      <button
        className="garden-plant plant-right interactive-flower"
        type="button"
        data-blossom-level={blossomLevel}
        aria-label={blossomLevel === 5
          ? "Touch the fully blossomed love flower to reveal Zack's little note"
          : "Love blossom: " + blossomLevel + " of 5 petals open. Explore to help it bloom"}
        title={"Love blossom · " + blossomLevel + " of 5 petals"}
        onClick={tendLoveBlossom}
      >
        <i /><i /><i /><b />
        {Array.from({ length: 6 }, (_, index) => (
          <span key={index} className="love-bloom-petal" aria-hidden="true" />
        ))}
      </button>
      <div className="garden-cat-wrap"><CatCharacter mood="curious" onClick={greetCat} label="Pet Mimi the kitten and hear a new greeting" /></div>
      {bugs.map((bug, index) =>
        <div className={"garden-bug garden-bug-" + (index + 1)} key={bug.id}>
          <Ladybug label={"Follow this ladybug: " + bug.label} onClick={() => onOpenNote(bug.id)} />
        </div>
      )}
      <div className="garden-heart garden-heart-one" aria-hidden="true">♥</div>
      <div className="garden-heart garden-heart-two" aria-hidden="true">♥</div>
      <div className="garden-signature">for Malika, with love · Zack</div>
      <div className="constellation-hint" aria-live="polite">
        {constellationFound ? "♡ a heart-shaped wish was found" : "Psst… trace the three stars · " + constellationStep + "/3"}
      </div>
    </div>
    <div className="garden-interaction-row">
      <div className="cat-reply" aria-live="polite"><span className="reply-sparkle" aria-hidden="true">✦</span><span>{catMessage || "Mimi is on birthday duty, keeping a tiny eye on the stars."}</span></div>
      <div className="discovery-counter" aria-live="polite" aria-atomic="true"><span aria-hidden="true">♡</span> {discoveredCount} / {noteCount} little notes discovered</div>
    </div>
    <div className="garden-destinations">
      <button className="destination-link destination-game" type="button" onClick={onGoToGame}><span className="destination-icon" aria-hidden="true">♥</span><span><strong>Mimi's heart garden</strong><small>Help her find {requiredHearts} little hearts</small></span><span className="destination-arrow" aria-hidden="true">↗</span></button>
      <button className="destination-link" type="button" onClick={onGoToCollection}><span className="destination-icon destination-icon-note" aria-hidden="true">✉</span><span><strong>The love collection</strong><small>35 notes, birthday wishes, and little dreams</small></span><span className="destination-arrow" aria-hidden="true">↗</span></button>
      <button className="destination-link" type="button" onClick={onOpenLetter}><span className="destination-icon destination-icon-letter" aria-hidden="true">♡</span><span><strong>A letter from Zack</strong><small>A birthday letter made just for Malika</small></span><span className="destination-arrow" aria-hidden="true">↗</span></button>
    </div>
    <GardenCompanionStudio
      discoveredCount={discoveredCount}
      heartsCollected={heartsCollected}
      releasedWishes={releasedWishes}
      onReleaseWish={onReleaseWish}
    />
    <aside className="curiosity-guide" aria-label="Optional clues for curious explorers">
      <details className="curiosity-guide-root">
        <summary>
          <span className="curiosity-guide-mark" aria-hidden="true">✧</span>
          <span className="curiosity-guide-title">
            <strong>Need a tiny nudge?</strong>
            <small>Only if you would like a little help finding the hidden magic.</small>
          </span>
          <span className="curiosity-guide-toggle" aria-hidden="true">＋</span>
        </summary>
        <div className="curiosity-guide-content">
          <p className="curiosity-guide-intro">Tiny clue: this garden listens when you say hello more than once. The moon and Mimi may have more to share than you first noticed.</p>
          <details className="curiosity-guide-step">
            <summary>Give me a clearer clue</summary>
            <p>Numbers are part of the magic: <strong>3, 4, 5, and 7</strong>. Look again at the welcome moon, Mimi, the little heart in the header, the ladybugs, and the smallest star at the bottom of the page.</p>
          </details>
        </div>
      </details>
    </aside>
  </section>;
}
