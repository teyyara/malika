import React, { useState } from "react";
import { motion } from "motion/react";
import { loveMessages, messageCategories } from "../data/loveMessages.js";
import { memories } from "../data/memories.js";

export default function LoveCollectionScene({ gameWon, discoveredIds, onOpenNote }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const items = [...loveMessages, ...memories.map((memory) => ({ ...memory, category: "memories", unlock: "start" }))];
  const filtered = items.filter((item) => selectedCategory === "all" || item.category === selectedCategory);
  return <section className="collection-scene scene-pane" aria-labelledby="collection-heading">
    <div className="scene-heading"><p className="eyebrow">✦ little reminders to keep</p><h1 id="collection-heading">The love collection</h1><p>Every little note is a small pause in your day. Open a note that calls to you, and come back whenever you need a reminder.</p></div>
    <div className="collection-meta"><span><b>{discoveredIds.length}</b> discovered</span><span className="collection-meta-divider" /><span><b>{items.length}</b> little keepsakes</span></div>
    <div className="category-tabs" role="group" aria-label="Filter love notes">{messageCategories.map((category) => <button key={category.id} type="button" className={selectedCategory === category.id ? "category-tab is-active" : "category-tab"} aria-pressed={selectedCategory === category.id} onClick={() => setSelectedCategory(category.id)}>{category.label}</button>)}</div>
    {selectedCategory === "memories" && memories.length === 0 ? <div className="memory-empty"><div aria-hidden="true">✿</div><h2>Our little memories</h2><p>This shelf is saved for real moments you choose to add. For now, it stays gently empty rather than filling itself with made-up stories.</p></div> : <div className="message-grid">
      {filtered.map((message, index) => {
        const locked = message.unlock === "game" && !gameWon;
        const discovered = discoveredIds.includes(message.id);
        return <motion.button key={message.id} className={"message-card" + (locked ? " is-locked" : "") + (discovered ? " is-discovered" : "")} type="button" disabled={locked}
          aria-label={locked ? "Secret letter locked. Collect the hearts to unlock it." : "Open note: " + message.title} onClick={() => onOpenNote(message.id)}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: Math.min(index * 0.018, 0.16) }}>
          <span className="message-card-top"><span className="message-glyph" aria-hidden="true">{locked ? "✧" : message.category === "wishes" ? "✿" : message.category === "secret" ? "✉" : "♥"}</span><span className="message-state">{locked ? "locked" : discovered ? "kept close" : "open note"}</span></span>
          <strong>{locked ? "A secret just for you" : message.title}</strong>
          <span className="message-preview">{locked ? "Collect the hearts in Mimi's garden to reveal this letter." : message.text}</span>
          <span className="message-card-footer">{locked ? "unlock in the game" : "open little note"} <span aria-hidden="true">↗</span></span>
        </motion.button>;
      })}
    </div>}
  </section>;
}
