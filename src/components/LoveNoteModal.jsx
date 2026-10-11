import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function LoveNoteModal({ message, onClose, senderName = "Zack" }) {
  const closeRef = useRef(null);
  useEffect(() => {
    if (!message) return undefined;
    const previousFocus = document.activeElement;
    closeRef.current?.focus();
    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const dialog = closeRef.current?.closest('[role="dialog"]');
        const controls = dialog ? [...dialog.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')] : [];
        if (controls.length === 0) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
    };
  }, [message, onClose]);

  return <AnimatePresence>
    {message && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.section className="love-note-modal" role="dialog" aria-modal="true" aria-labelledby="love-note-title"
        initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }} transition={{ duration: 0.24 }}>
        <div className="note-sparkle" aria-hidden="true">✦</div>
        <button ref={closeRef} className="icon-button modal-close" type="button" onClick={onClose} aria-label="Close love note">×</button>
        <p className="eyebrow">A little note from {senderName}</p><h2 id="love-note-title">{message.title}</h2>
        <p className="modal-copy">{message.text}</p><div className="modal-heart" aria-hidden="true">♥</div>
        <p className="modal-signature">all my love, {senderName} ♡</p>
        <button className="button button-secondary" type="button" onClick={onClose}>Keep this close</button>
      </motion.section>
    </motion.div>}
  </AnimatePresence>;
}
