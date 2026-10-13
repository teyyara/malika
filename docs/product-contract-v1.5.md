# Product Contract v1.5 — Malika Birthday Universe

Status: Loop 031 change request proposed for implementation on 13 October 2026. Product Contract v1.4 remains the prior baseline; this version adds a page-by-page collection of 100 authored affirmations.

## Change request CR-031 — A Hundred Little Reasons I Love You

**Objective:** add a quiet, optional reading experience inside the existing birthday letter scene, without another destination or saved progress.

### REQ-018 — Page-by-page reasons book

The birthday letter scene must offer an optional book containing 100 distinct reasons and reflections from Zack to Malika.

**Acceptance criteria**
1. The book is placed inside the existing birthday letter scene and collapsed by default; no new navigation destination is added.
2. The dataset contains exactly 100 unique, non-empty entries.
3. The first page is visible when opened. Next/previous controls update the page and an accessible progress indicator reports the current page.
4. The first page disables Previous; the last page offers a Begin again action that returns to page 1.
5. The book fits tested laptop and phone viewports without horizontal overflow and uses visible focus styles.
6. Nonessential page transitions honor reduced-motion preferences.
7. Page state is ephemeral React state. Leaving the scene unmounts the book and resets it. No browser storage, server, account, analytics, paid API, external service, package, or remote asset is introduced.
8. Existing birthday letter text, surprise reveal, main navigation, and all existing game/secret behavior remain unchanged.

**Risk:** R1 (new optional interaction inside the final letter scene).  
**Validation:** Node/content test verifies the exact count and uniqueness. Playwright covers collapsed state, page navigation, endpoints, reset-on-return, and phone layout. Node/content tests, production build, and the complete Chromium suite remain required.

## Evidence standard

Only exact PR-head CI supports promotion to main. Passing automation does not certify physical-device, screen-reader, or production-alias behavior.
