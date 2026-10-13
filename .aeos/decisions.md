# Architecture and decision log

## D-001 — React + Vite single-page application
Matches the supplied brief. Scene changes happen in application state.

## D-002 — Reducer-controlled gameplay
Game transitions live in a pure function using stable IDs. Repeat clicks on removed IDs and scoring after victory are ignored.

## D-003 — Motion + CSS
Motion handles scene entrances and tap feedback. CSS handles ambient decoration and reduced-motion overrides.

## D-004 — Original inline SVG art
The recurring cat and ladybug are local SVG/CSS illustrations, with no third-party image URL required at runtime.

## D-005 — Native Node test runner
Use node:test for the game-state core without another test dependency. Browser tests remain a separate gate.

## D-006 — Separate progression branch
Repository was empty on intake. main was bootstrapped; implementation is isolated on aeos/progression until CI is observed. Main is subsequently updated by fast-forward for the explicitly requested boss assessment. Deployment is distinct.

## D-007 — Fill personal details; do not invent past events
Use Malika, Zack, and 12 October in the live content. Since no real shared memories were supplied, replace the empty memory shelf with five clearly future-facing dreams and wishes. This provides a full content section without misleading the recipient.


## D-007 — Reuse the garden flower as a progress-driven keepsake

The Love Blossom extends the existing interactive flower rather than adding another scene or companion tab. Its five stages derive only from current-visit note discoveries, hearts, and wishes. This keeps the interaction visible in the garden, avoids more laptop scrolling, uses the existing live reply for feedback, and has no persistence or service side effects.
