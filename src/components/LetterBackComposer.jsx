import React, { useState } from "react";
import { siteConfig } from "../data/siteConfig.js";

const openingIdeas = [
  { id: "smile", label: "Something that made me smile", text: "Something that made me smile was…" },
  { id: "wish", label: "A little wish for us", text: "A little wish I have for us is…" },
  { id: "thankyou", label: "A small thank-you", text: "Something I want to thank you for is…" },
  { id: "tell", label: "Something I want you to know", text: "One tiny thing I want you to know is…" }
];

export default function LetterBackComposer() {
  const [draft, setDraft] = useState("");
  const [stage, setStage] = useState("writing");
  const [copyStatus, setCopyStatus] = useState("");
  const cleanDraft = draft.trim();
  const letterText = "Dear " + siteConfig.senderName + ",\n\n" + cleanDraft + "\n\nWith love,\n" + siteConfig.recipientName + " ♡";

  function addOpening(text) {
    setDraft((current) => {
      const next = current.trim() ? current.trimEnd() + "\n\n" + text : text;
      return next.slice(0, 800);
    });
    setCopyStatus("");
  }

  function foldLetter() {
    if (!cleanDraft) return;
    setCopyStatus("");
    setStage("folded");
  }

  async function copyLetter() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard is unavailable");
      await navigator.clipboard.writeText(letterText);
      setCopyStatus("Copied. Nothing was sent — the note is still yours to share.");
    } catch {
      setCopyStatus("Automatic copy is not available in this browser. You can select the letter above and copy it yourself.");
    }
  }

  return (
    <section className="letter-back" aria-labelledby="letter-back-heading">
      <details className="letter-back-disclosure">
        <summary>
          <span className="letter-back-stamp" aria-hidden="true">✎</span>
          <span className="letter-back-summary-copy">
            <span className="letter-back-eyebrow">A LITTLE SPACE FOR YOUR WORDS</span>
            <strong id="letter-back-heading">A Little Letter Back</strong>
            <small>A tiny note from your side of our story, whenever you feel like writing one.</small>
          </span>
          <span className="letter-back-summary-action">Write a little note <span aria-hidden="true">⌄</span></span>
        </summary>
        <div className="letter-back-content">
          <p className="letter-back-intro">Dear Malika, this space is yours. It can be a wish, a thank-you, a thought, a memory only you know, or just a few words for Zack.</p>
          <p className="letter-back-privacy">Your words live only in this open page. Nothing is sent or saved, and refreshing clears the draft. When it feels right, you can copy the note yourself.</p>

          {stage === "writing" ? (
            <div className="letter-back-editor">
              <div className="letter-back-prompts" role="group" aria-label="Optional writing starters">
                <span className="letter-back-prompt-label">Need a first line?</span>
                {openingIdeas.map((idea) => (
                  <button key={idea.id} className="letter-back-prompt" type="button"
                    aria-label={"Add opening: " + idea.label} onClick={() => addOpening(idea.text)}>
                    {idea.label} <span aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
              <label className="letter-back-field" htmlFor="letter-back-draft">
                <span>Your letter to Zack</span>
                <span className="letter-back-field-hint">Write in your own words. There is no perfect way to say it.</span>
                <textarea id="letter-back-draft" className="letter-back-textarea" value={draft}
                  onChange={(event) => { setDraft(event.target.value); setCopyStatus(""); }}
                  maxLength={800} rows={6} placeholder="One little thought at a time…" />
              </label>
              <div className="letter-back-editor-footer">
                <span className="letter-back-counter">{draft.length} / 800 characters</span>
                <button className="letter-back-primary" type="button" disabled={!cleanDraft} onClick={foldLetter}>
                  Fold my little letter <span aria-hidden="true">♡</span>
                </button>
              </div>
            </div>
          ) : (
            <article className="letter-back-envelope" aria-labelledby="letter-back-preview-heading">
              <div className="letter-back-envelope-top">
                <span className="letter-back-postmark" aria-hidden="true">♡</span>
                <div>
                  <span className="letter-back-eyebrow">WRITTEN BY YOU, KEPT BY YOU</span>
                  <h3 id="letter-back-preview-heading">A little note for {siteConfig.senderName}</h3>
                </div>
              </div>
              <div className="letter-back-paper">
                <p className="letter-back-salutation">Dear {siteConfig.senderName},</p>
                <p className="letter-back-message">{cleanDraft}</p>
                <p className="letter-back-signoff">With love,</p>
                <strong className="letter-back-signature">{siteConfig.recipientName} ♡</strong>
              </div>
              <div className="letter-back-actions">
                <button className="letter-back-secondary" type="button" onClick={() => { setStage("writing"); setCopyStatus(""); }}>
                  Keep writing
                </button>
                <button className="letter-back-primary" type="button" onClick={copyLetter}>
                  Copy my letter <span aria-hidden="true">⧉</span>
                </button>
              </div>
              {copyStatus && <p className="letter-back-status" role="status">{copyStatus}</p>}
            </article>
          )}
        </div>
      </details>
    </section>
  );
}
