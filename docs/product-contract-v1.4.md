# Product Contract v1.4 — Malika Birthday Universe

Status: Loop 030 implemented and validated on 13 October 2026; exact PR-head and post-merge main workflows passed. Product Contract v1.3 remains the prior baseline; this version adds a private, page-only letter composer.

## Change request CR-030 — A Little Letter Back

**Objective:** give Malika a small space to write her own note to Zack, without transmitting or persisting any personal writing.

### REQ-017 — Private in-page letter composer

The existing Love Notes scene must provide an optional letter composer that lets Malika draft, preview, edit, and copy her own words.

**Acceptance criteria**
1. The composer is placed inside Love Notes and is collapsed by default; no new top-level navigation destination is added.
2. Writing starters are optional and can be used without replacing existing text.
3. The draft is limited to 800 characters, and the preview formats the user's own words as a letter to Zack from Malika.
4. The composer clearly states that text is not sent or saved, and a page refresh clears the draft.
5. A copy action uses the browser clipboard when available; when unavailable, the interface explains that manual selection and copying is possible.
6. Editing after preview preserves the current draft. The controls are keyboard-operable, have visible focus, and animations honor reduced-motion preferences.
7. Laptop and phone layouts fit without horizontal overflow.
8. Draft and preview state exist in React memory only. No form submission, server endpoint, analytics, account, browser storage, external service, paid API, dependency, or remote asset is introduced.
9. Existing love notes, future letters, categories, search, navigation, and the 35-item keepsake collection remain unchanged.

**Risk:** R1 (interactive personal-writing UI in existing scene).  
**Validation:** Playwright journeys cover the collapsed state, privacy explanation, starters, blank-submit guard, preview/edit preservation, clipboard success/fallback, and responsive bounds. Node/content tests, production build, and the complete Chromium suite remain required.

## Evidence standard

Exact PR-head CI [run 38420686468](https://github.com/teyyara/malika/actions/runs/38420686468) and post-merge main CI [run 38421421971](https://github.com/teyyara/malika/actions/runs/38421421971) passed Node/content tests, production build, and the full 53-journey Chromium suite. Passing automation does not certify physical-device, screen-reader, or production-alias behavior.
