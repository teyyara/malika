import React, { useState } from "react";
import { motion } from "motion/react";
import { loveMessages, messageCategories } from "../data/loveMessages.js";
import { memories } from "../data/memories.js";
import { siteConfig } from "../data/siteConfig.js";

export default function LoveCollectionScene({ gameWon, discoveredIds, onOpenNote }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const items = [...loveMessages, ...memories];
  const filtered = items.filter((item) => selectedCategory === "all" || item.category === selectedCategory);
  return <section className="collection-scene scene-pane" aria-labelledby="collection-heading">
    <div className="scene-heading"><p className="eyebrow">✦ little reminders from {siteConfig.senderName}</p><h1 id="collection-heading">The love collection</h1><p>{loveMessages.length} notes, birthday wishes, and {memories.length} little dreams for us. Open a note that calls to you, and come back whenever you need a gentle reminder.</p></div>
    <div className="collection-meta"><span><b>{discoveredIds.length}</b> discovered</span><span className="collection-meta-divider" /><span><b>{items.length}</b> little keepsakes</span></div>
    <div className="category-tabs" role="group" aria-label="Filter love notes">{messageCategories.map((category) => <button key={category.id} type="button" className={selectedCategory === category.id ? "category-tab is-active" : "category-tab"} aria-pressed={selectedCategory === category.id} onClick={() => setSelectedCategory(category.id)}>{category.label}</button>)}</div>
    <div className="message-grid">
      {filtered.map((message, index) => {
        const locked = message.unlock === "game" && !gameWon;
        const discovered = discoveredIds.includes(message.id);
        return <motion.button key={message.id} className={"message-card" + (locked ? " is-locked" : "") + (discovered ? " is-discovered" : "")} type="button" disabled={locked}
          aria-label={locked ? "Secret letter locked. Collect seven hearts to unlock it." : "Open note: " + message.title} onClick={() => onOpenNote(message.id)}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: Math.min(index * 0.018, 0.16) }}>
          <span className="message-card-top"><span className="message-glyph" aria-hidden="true">{locked ? "✧" : message.category === "wishes" ? "✿" : message.category === "secret" ? "✉" : message.category === "memories" ? "☾" : "♥"}</span><span className="message-state">{locked ? "locked" : discovered ? "kept close" : "open note"}</span></span>
          <strong>{locked ? "A secret just for you" : message.title}</strong>
          <span className="message-preview">{locked ? "Collect the seven purple hearts in Mimi's garden to reveal this letter." : message.text}</span>
          <span className="message-card-footer">{locked ? "unlock in the game" : "open little note"} <span aria-hidden="true">↗</span></span>
        </motion.button>;
      })}
    </div>
    <p className="collection-signoff">Every note is a little reminder from {siteConfig.senderName} to {siteConfig.recipientName}. ♡</p>
  </section>;
}
