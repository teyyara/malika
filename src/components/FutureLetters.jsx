import React, { useState } from "react";
import { futureLetters } from "../data/futureLetters.js";

export default function FutureLetters() {
  const [selectedId, setSelectedId] = useState(null);
  const selectedLetter = futureLetters.find((letter) => letter.id === selectedId);

  return <section className="future-letters" aria-labelledby="future-letters-heading">
    <details className="future-letters-disclosure">
      <summary>
        <span className="future-letters-seal" aria-hidden="true">✉</span>
        <span className="future-letters-summary-copy">
          <span className="future-letters-eyebrow">A LITTLE WINDOW INTO TOMORROW</span>
          <strong id="future-letters-heading">Letters from Future Us</strong>
          <small>Four little daydreams, written like notes from a possible tomorrow.</small>
        </span>
        <span className="future-letters-summary-action">Open the little time-window <span aria-hidden="true">⌄</span></span>
      </summary>
      <div className="future-letters-content">
        <p className="future-letters-disclaimer">These are imagined little tomorrows—not memories, predictions, or promises. Just a few tender possibilities to daydream about together. ♡</p>
        <div className="future-letter-choices" role="group" aria-label="Choose an imagined future letter">
          {futureLetters.map((letter) => (
            <button key={letter.id}
              className={"future-letter-choice future-letter-choice--" + letter.id + (selectedId === letter.id ? " is-selected" : "")}
              type="button" aria-label={"Read future letter: " + letter.title} aria-pressed={selectedId === letter.id}
              onClick={() => setSelectedId(letter.id)}>
              <span className="future-letter-choice-symbol" aria-hidden="true">{letter.symbol}</span>
              <span className="future-letter-choice-kicker">{letter.kicker}</span>
              <strong>{letter.title}</strong>
              <span className="future-letter-choice-preview">{letter.preview}</span>
              <span className="future-letter-choice-action">{selectedId === letter.id ? "Letter opened" : "Read this little future"} <span aria-hidden="true">↗</span></span>
            </button>
          ))}
        </div>
        {selectedLetter && <article className="future-letter-reveal" aria-labelledby="future-letter-title">
          <div className="future-letter-reveal-top">
            <span className="future-letter-postmark" aria-hidden="true">{selectedLetter.symbol}</span>
            <div className="future-letter-reveal-heading">
              <span className="future-letters-eyebrow">POSTMARKED FROM AN IMAGINED TOMORROW</span>
              <h3 id="future-letter-title" aria-live="polite">{selectedLetter.title}</h3>
            </div>
            <button className="future-letter-close" type="button" aria-label="Close future letter" onClick={() => setSelectedId(null)}>×</button>
          </div>
          <div className="future-letter-paper">
            <p className="future-letter-salutation">My love,</p>
            {selectedLetter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <p className="future-letter-closing">{selectedLetter.closing}</p>
            <p className="future-letter-signoff">Always imagining gentle tomorrows with you,</p>
            <strong className="future-letter-signature">Zack ♡</strong>
          </div>
        </article>}
      </div>
    </details>
  </section>;
}
