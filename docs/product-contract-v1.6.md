# Product Contract v1.6 — Malika Birthday Universe

Status: Loop 032 change request implemented on a feature branch on 13 October 2026. Product Contract v1.5 remains the prior baseline; this version adds a small branching fairytale inside the existing garden companion studio.

## Change request CR-032 — Mimi's Tiny Storybook

**Objective:** let Malika shape an original mini fairytale through three choices, using existing character art and no new navigation destination.

### REQ-019 — A branch-consistent storybook

The garden companion studio must provide an optional interactive fairytale with three chapters, each containing three choices.

**Acceptance criteria**
1. The feature is an additional tab in the existing companion studio, not a new top-level scene.
2. Its introduction clearly says it is a made-up fairytale, not a memory or claim about past events.
3. The flow has exactly three chapters and three choices per chapter. Selected choices are visibly indicated and a progress indicator reflects how many choices have been made.
4. The final story includes the passage for each selected choice and an ending that matches the third choice.
5. Going back and changing an earlier choice clears later choices so stale answers cannot create an inconsistent ending.
6. **Tell another tiny story** returns the experience to the beginning with no previous answers selected.
7. Layout fits the tested laptop and 375px phone viewport with no horizontal overflow, visible focus, native keyboard-operable buttons, and reduced-motion behavior.
8. All content and choices are local source data; current progress lives only in React component state and resets when the companion tab unmounts.
9. No browser storage, backend, analytics, paid API, new package, remote asset, or outside service is introduced.

**Risk:** R1 (branching interaction in the existing companion destination).
**Validation:** Node/content tests check the authored chapters, unique choice IDs, and completed endings. Playwright covers choice flow, passage composition, progress, backtracking invalidation, replay reset, reduced motion, and mobile viewport bounds. Node/content tests, production build, and the complete Chromium suite must pass on the exact PR head before merge.

## Evidence standard

Only exact PR-head CI supports promotion to main. Passing automation does not certify physical-device, screen-reader, or production-alias behavior.
