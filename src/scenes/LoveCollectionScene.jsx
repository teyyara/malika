import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { loveMessages, messageCategories } from "../data/loveMessages.js";
import { memories } from "../data/memories.js";
import { siteConfig } from "../data/siteConfig.js";
import FutureLetters from "../components/FutureLetters.jsx";

export default function LoveCollectionScene({ gameWon, discoveredIds, onOpenNote }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [query, setQuery] = useState("");
  const reduceMotion = useReducedMotion();
  const items = [...loveMessages, ...memories];
  const searchTerm = query.trim().toLocaleLowerCase();
  const filtered = items.filter((item) => {
    const locked = item.unlock === "game" && !gameWon;
    const searchableText = [
      locked ? "secret letter locked" : item.title,
      locked ? "collect purple hearts to unlock" : item.text,
      item.category
    ].join(" ").toLocaleLowerCase();
    return (selectedCategory === "all" || item.category === selectedCategory) &&
      (!searchTerm || searchableText.includes(searchTerm));
  });

  return <section className="collection-scene scene-pane" aria-labelledby="collection-heading">
    <div className="scene-heading">
      <p className="eyebrow">✦ little reminders from {siteConfig.senderName}</p>
      <h1 id="collection-heading">The love collection</h1>
      <p>{loveMessages.length} notes, birthday wishes, and {memories.length} little dreams for us. Open a note that calls to you, and come back whenever you need a gentle reminder.</p>
    </div>
    <div className="collection-meta">
      <span><b>{discoveredIds.length}</b> discovered</span><span className="collection-meta-divider" />
      <span><b>{items.length}</b> little keepsakes</span>
    </div>
    <FutureLetters />
    <div className="collection-tools">
      <label className="collection-search">
        <span className="collection-search-label">find a note by feeling or word</span>
        <span className="collection-search-field">
          <span aria-hidden="true" className="collection-search-icon">⌕</span>
          <input type="search" aria-label="Search love notes" placeholder="Search notes, wishes, memories…" value={query} onChange={(event) => setQuery(event.target.value)} />
          {query && <button type="button" className="collection-search-clear" aria-label="Clear love-note search" onClick={() => setQuery("")}>×</button>}
        </span>
      </label>
      <div className="category-tabs" role="group" aria-label="Filter love notes">
        {messageCategories.map((category) =>
          <button key={category.id} type="button" className={selectedCategory === category.id ? "category-tab is-active" : "category-tab"}
            aria-pressed={selectedCategory === category.id} onClick={() => setSelectedCategory(category.id)}>
            {category.label}
          </button>
        )}
      </div>
    </div>
    <p className="collection-results" aria-live="polite">
      {searchTerm ? "Found " + filtered.length + (filtered.length === 1 ? " little keepsake" : " little keepsakes") : "Showing all " + items.length + " keepsakes"}
    </p>
    <motion.div className="message-grid">
      <AnimatePresence mode="popLayout" initial={false}>
        {filtered.map((message, index) => {
          const locked = message.unlock === "game" && !gameWon;
          const discovered = discoveredIds.includes(message.id);
          return <motion.button key={message.id} className={"message-card" + (locked ? " is-locked" : "") + (discovered ? " is-discovered" : "")}
            type="button" disabled={locked}
            aria-label={locked ? "Secret letter locked. Collect seven hearts to unlock it." : "Open note: " + message.title}
            onClick={() => onOpenNote(message.id)}
            initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.994 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 5, scale: 0.99 }}
            whileHover={reduceMotion || locked ? undefined : { y: -4, scale: 1.006 }}
            whileTap={reduceMotion || locked ? undefined : { scale: 0.99 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.2, delay: reduceMotion ? 0 : Math.min(index * 0.006, 0.055) }}>
            <span className="message-card-edge" aria-hidden="true" />
            <span className="message-card-top">
              <span className="message-glyph" aria-hidden="true">{locked ? "✧" : message.category === "wishes" ? "✿" : message.category === "secret" ? "✉" : message.category === "memories" ? "☾" : "♥"}</span>
              <span className="message-state">{locked ? "locked" : discovered ? "kept close" : "open note"}</span>
            </span>
            <strong>{locked ? "A secret just for you" : message.title}</strong>
            <span className="message-preview">{locked ? "Collect the seven purple hearts in Mimi's garden to reveal this letter." : message.text}</span>
            <span className="message-card-footer">{locked ? "unlock in the game" : "open little note"} <span aria-hidden="true">↗</span></span>
          </motion.button>;
        })}
      </AnimatePresence>
    </motion.div>
    {filtered.length === 0 && <motion.div className="collection-empty" role="status"
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <span aria-hidden="true">☾</span><strong>No little note found this time.</strong>
      <p>Try a different word, or choose another feeling above.</p>
      <button className="text-button" type="button" onClick={() => { setQuery(""); setSelectedCategory("all"); }}>Open the whole collection</button>
    </motion.div>}
    <p className="collection-signoff">Every note is a little reminder from {siteConfig.senderName} to {siteConfig.recipientName}. ♡</p>
  </section>;
}
