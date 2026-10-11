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
Use node:test for the game state core without another test dependency. Browser tests remain a separate gate.

## D-006 — Separate progression branch
Repository was empty on intake. main was bootstrapped; implementation is isolated on aeos/progression. Release promotion is not automatic.
