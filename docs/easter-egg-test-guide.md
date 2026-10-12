# Easter-egg testing guide — Loop 005

Everything below is intentionally discoverable, local-only, and spoiler-filled. No sound, paid API, account, or backend is required. The five mini-games have no timer; the secret progress counter lasts for the current visit only.

## Hidden entrances

1. **The classic Secret Arcade** — on any scene, type the keyboard sequence: Up, Up, Down, Down, Left, Right, Left, Right, B, A. The cabinet opens with five games.
2. **Her name in the sky** — type `MALIKA` on the page. An animated starfall reveal appears; its button takes you to the arcade.
3. **Mimi's shortcut** — type `MIMI` on the page. It jumps straight into Mimi's Memory Match.
4. **The wish moon** — on the welcome screen, click the large moon seven times within nine seconds. The moon opens its private birthday wish.
5. **Mimi's fifth hello** — pet Mimi five times within eight seconds. The fifth interaction triggers her animated paw parade.
6. **A quiet thank-you** — after entering the garden, click or keyboard-activate the little footer star button (✦) three times within seven seconds for a small reveal.
7. **Ladybug trail** — click any ladybug four times within nine seconds, closing each love-note popup in between. A small toast appears with an arcade shortcut.
8. **The heart-mark door** — once the header is visible, click the little heart inside “for Malika” five times within seven seconds. This opens the Secret Arcade directly.

Triggers are case-insensitive for the typed words. The timing windows are intentionally forgiving, and these are extra rewards; none are required to finish the main birthday experience.

## Five hidden mini-games

Open the arcade from any entrance above.

### 1. Seven-star catcher
Choose **Seven-star catcher**. Click any seven of the twelve twinkling stars. Each star can only count once; after seven, the star-shower victory message appears.

### 2. Mimi's memory match
Choose **Mimi's memory match**. Find the moon pair, pawprint pair, and purple-heart pair. A mismatched pair gets a soft rose outline and a live hint, then turns face-down after a brief pause. Choosing a third card during that pause moves on immediately. There is no game countdown. For a quick smoke test, the card IDs are moon-a + moon-b, paw-a + paw-b, and heart-a + heart-b.

Typing `MIMI` starts this game directly.

### 3. Pawprint rhythm
Choose **Pawprint rhythm**. Click the four symbols in this order: **🐾 pawprints → 🌙 moon → 💜 purple heart → ✨ sparkle**. A wrong tap resets progress, with a gentle hint.

### 4. Firefly hunt
Choose **Firefly hunt**. Catch any five of the eight glowing fireflies. Each only counts once; there is no countdown.

The fourth ladybug discovery displays a toast that points you back to the arcade and this game.

### 5. The little wish jar
Choose **The little wish jar**. Press **Shake the wish jar** repeatedly. Each shake animates the jar and reveals the next of five optimistic, future-facing wishes. They are wishes, not fabricated memories of events that happened.

## Expected visual effects

- The secret dialog blooms in with blur/scale easing and a layered lavender night-sky panel.
- Each reveal gets its own animated glyph: moon-glow, paw dance, comet/starfall, or a tiny sparkle thank-you.
- Stars float and shimmer; caught stars sparkle away.
- Memory cards flip into view; a mismatched pair gets a brief rose outline and flips back after a short feedback pause; the rhythm buttons press in; fireflies glow/flicker.
- The wish jar gently rocks while its wishes appear.
- A “Secrets uncovered” counter rises as you discover entrances and win games.

## Need a hint?

The garden includes an optional **Need a tiny nudge?** clue trail. It starts with a gentle hint and only shows the full spoiler map when that nested section is opened. On a small screen you can use the header heart or the ladybug trail instead of typing keyboard codes. The walkthrough and QA scope are in [Loop 008 — Gentle secret clues](loop-008-gentle-secret-hints.md).

## Accessibility and test notes

Every target is a button or is inside a keyboard-addressable flow. The footer star is a labelled, keyboard-focusable button rather than decorative text. Dialogs can be closed with **Escape** or the close button. Reduced-motion preferences disable the nonessential keyframe animations. Automated browser tests are in `e2e/easter-eggs.spec.js`; run them with `npm run test:e2e`.

The Easter-egg counters and achievements are ephemeral (not stored in a server or local storage). Reloading the page starts a fresh hunt. The hidden content does not block the birthday letter, existing notes, constellation, or main heart game.
