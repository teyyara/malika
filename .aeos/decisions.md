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


## D-008 — Keep future letters optional and explicitly imagined

Add the future-letter archive inside the existing Love Notes scene, rather than creating a fifth navigation destination or extending the always-visible page. Use a native details/summary disclosure that is closed by default, four data-driven selections, and an inline pearl-paper reading panel. State explicitly that the writing is speculative daydreaming rather than memory or promise. Keep selection in component state and use no third-party assets or services.


## D-009 — Keep the reply letter private and ephemeral

A Little Letter Back lets Malika write from her side of the story without building a submission system. Drafts remain in React component state only and are cleared on refresh. Copying is explicit, client-side, and optional, with a manual-copy fallback. No network request, browser storage, backend, account, analytics, package, or external service is permitted.


## D-010 — Keep the reasons book page-by-page and session-only

A Hundred Little Reasons I Love You lives inside the existing birthday letter scene, not in navigation. Only one authored page is shown at a time to avoid a long wall of text; the progress indicator makes the sequence legible. Page state stays in React memory and resets when the scene unmounts. No persistent progress or new service is allowed.


## D-011 — Keep Mimi's storybook fictional, branch-consistent, and local

Mimi's Tiny Storybook is a fifth tab inside the existing garden companion studio, not a new top-level destination. Three authored chapters each provide three options; later selections clear when an earlier choice changes so the displayed ending always matches the path. The story is explicitly marked as an invented fairytale, and all state remains in component memory. Use the existing CatCharacter and Ladybug art; add no new packages, remote assets, or service.


## D-012 — Let Mimi's recorded voice carry her love language

Keep musical tones for interface and celebratory moments, but don't use them as a substitute for a cat vocalization where the interaction explicitly depicts Mimi vocalizing. The whispered-secret action now selects the already-bundled local purr recording, complementing the existing purr on cuddle/nap and recorded meow on playful ribbon/dance. Keep the existing master mute and local-asset approach; no new audio download, dependency, browser storage, or service is needed.


## D-012 — Give the companion tablist a complete keyboard pattern

The companion studio already uses ARIA tabs. Complete their keyboard model with a single Tab stop, Left/Right Arrow navigation with wraparound, and Home/End shortcuts. Move focus and selected content together so keyboard users do not land on hidden panels or need five Tab presses to cross the studio. Keep the existing visual layout, native button controls, reduced-motion behavior, and visit-only state; no new service or package.


## D-012 — Make storybook motion and sound preference-aware

Loop 035 enhances the existing storybook rather than adding a new destination. Use a keyed motion page for phase/chapter entry and subtle illustration accents, with reduced-motion preference skipping the entrance motion. Use only the existing synthesized playCuteSound melodies for story cues; the global sound controls remain authoritative. Keep branch choices, state resets and all story text behavior unchanged. No file-based sound, remote asset, dependency or storage is needed.
