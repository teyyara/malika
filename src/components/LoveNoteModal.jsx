import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { playCuteSound } from "../audio/soundEffects.js";

const noteMotes = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  glyph: ["✦", "♡", "✧", "·", "♥"][index % 5],
  left: ((index * 43 + 9) % 94) + "%",
  top: ((index * 31 + 4) % 88) + "%",
  drift: ((index % 5) - 2) * 18,
  delay: (index % 6) * 0.055
}));

export default function LoveNoteModal({ message, onClose, senderName = "Zack" }) {
  const closeRef = useRef(null);
  const [heartSent, setHeartSent] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!message) return undefined;
    const previousFocus = document.activeElement;
    setHeartSent(false);
    playCuteSound("note");
    closeRef.current?.focus();
    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const dialog = closeRef.current?.closest('[role="dialog"]');
        const controls = dialog
          ? [...dialog.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
            .filter((control) => !control.disabled && !control.closest('[hidden], [aria-hidden="true"]')
              && control.getClientRects().length > 0 && window.getComputedStyle(control).visibility !== "hidden")
          : [];
        if (controls.length === 0) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        const focusOutsideDialog = dialog && !dialog.contains(document.activeElement);
        if (event.shiftKey && (document.activeElement === first || focusOutsideDialog)) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || focusOutsideDialog)) { event.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
    };
  }, [message, onClose]);

  function sendHeart() {
    if (heartSent) return;
    setHeartSent(true);
    playCuteSound("love");
  }

  return <AnimatePresence>
    {message && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.28 }}
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.section className="love-note-modal" role="dialog" aria-modal="true" aria-labelledby="love-note-title" aria-describedby="love-note-copy"
        initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.94, rotateX: 3 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.985 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.24, type: "spring", stiffness: 250, damping: 25 }}>
        <div className="note-orbit-layer" aria-hidden="true">
          <span className="note-orbit note-orbit-one" /><span className="note-orbit note-orbit-two" />
          {noteMotes.map((mote) =>
            <motion.span key={mote.id} className="note-modal-mote" style={{ left: mote.left, top: mote.top }}
              animate={reduceMotion
                ? { opacity: 0.35 }
                : { opacity: [0.18, 0.82, 0.18], y: [0, -11, 0], x: [0, mote.drift, 0], rotate: [0, mote.drift, 0] }}
              transition={{ duration: 2.7 + (mote.id % 4) * 0.35, delay: reduceMotion ? 0 : mote.delay, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}>
              {mote.glyph}
            </motion.span>
          )}
        </div>
        <div className="note-sparkle" aria-hidden="true">✦</div>
        <button ref={closeRef} className="icon-button modal-close" type="button" onClick={onClose} aria-label="Close love note">×</button>
        <motion.p className="eyebrow" initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : 0.05 }}>A little note from {senderName}</motion.p>
        <motion.h2 id="love-note-title" initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={reduceMotion ? undefined : { scale: 1.025, rotate: -0.4 }} transition={{ delay: reduceMotion ? 0 : 0.09 }}>{message?.title}</motion.h2>
        <motion.p id="love-note-copy" className="modal-copy" initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : 0.13 }}>{message?.text}</motion.p>
        <motion.button type="button" className={"modal-heart modal-heart-button" + (heartSent ? " is-sent" : "")}
          aria-label={heartSent ? "A heart was sent back to Zack" : "Tap the floating heart to send a little heart back to Zack"}
          aria-pressed={heartSent} onClick={sendHeart}
          whileTap={reduceMotion ? undefined : { scale: 1.32, rotate: [0, -14, 14, 0] }}
          animate={reduceMotion ? { scale: 1 } : heartSent ? { scale: [1, 1.22, 1], rotate: [0, -10, 10, 0] } : { scale: [1, 1.12, 1], rotate: [0, -7, 0] }}
          transition={{ duration: reduceMotion ? 0.01 : heartSent ? 0.58 : 2.7, repeat: !reduceMotion && !heartSent ? Infinity : 0, ease: "easeInOut" }}>♥</motion.button>
        {heartSent && <motion.p className="note-heart-confirmation" role="status"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.2 }}>A little heart has found its way back to Zack. Mimi approves. ♡</motion.p>}
        <p className="modal-signature">all my love, {senderName} ♡</p>
        <button className="button button-secondary" type="button" onClick={onClose}>Keep this close</button>
      </motion.section>
    </motion.div>}
  </AnimatePresence>;
}
