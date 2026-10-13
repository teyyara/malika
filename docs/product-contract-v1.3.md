# Product Contract v1.3 — Malika Birthday Universe

Status: Loop 029 change request accepted for implementation on 13 October 2026. Product Contract v1.2 remains the prior baseline; this version adds the future-letter archive only.

## Change request CR-029 — Letters from Future Us

**Objective:** add a cozy, authored collection of possible tomorrows that makes the Love Notes experience richer without adding another top-level navigation destination.

### REQ-016 — Imagined future letters

The existing Love Notes scene must provide four selectable, clearly imagined future letters inside an optional disclosure.

**Acceptance criteria**
1. The disclosure is closed by default to preserve the existing laptop-first first view and 35-keep-sake count.
2. It contains four distinct scenarios: a rainy Sunday, an unplanned escape, an ordinary Tuesday, and a letter for a heavy day.
3. Opening a card displays its full letter on a styled reading panel. Selecting another changes the current letter; a close control clears the reading panel.
4. The feature states that the content represents imagined tomorrows, not memories, predictions, or promises.
5. It uses native summary/button controls, visible focus, accessible selected-state labels, and reduced-motion accommodations.
6. Layout fits the tested laptop viewport (1366×768) and phone viewport (375×812) without horizontal overflow.
7. State is ephemeral React component state. No persistence, account, backend, analytics, paid API, extra package, or remote asset is permitted.
8. Existing notes, categories/search behavior, navigation and their 35-item collection are unchanged.

**Risk:** R1 (new feature within the existing Love Notes scene).  
**Validation:** Playwright checks the closed state, four options, letter open/switch/close behavior, disclaimer, unchanged keepsake count, and responsive bounds. Node/content tests, production build, and the complete Chromium suite remain required.

## Evidence standard

Only exact-head CI supports promotion to main. Passing automation does not constitute physical-device, screen-reader, or production-alias certification.
