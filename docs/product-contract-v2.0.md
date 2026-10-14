# Product Contract v2.0 — Malika Birthday Universe

Status: Loop 036 change request implemented on a feature branch on 14 October 2026. Product Contract v1.9 is the preceding validated baseline; this change makes existing Wish sky content an optional part of Mimi's storybook ending.

## Change request CR-036 — A Wish Woven Into the Story

**Objective:** connect the current visit's released wishes to Mimi's existing fairytale, so the story can include one wish Malika has already sent into the sky without saving or duplicating any information.

### REQ-023 — Weave a sky wish into the storybook ending

When wishes have been released during this visit, Mimi's storybook ending offers a small optional selector to choose which wish appears on the last page.

**Acceptance criteria**
1. The existing Wish sky list is passed to the storybook from the parent React state; no copy of the wish list is persisted or independently stored.
2. The ending offers up to the five most recently released wishes. If no wish exists, the selector and in-story wish card are absent and the previous storybook layout remains unchanged.
3. When wishes exist, the latest wish is selected by default. A visible intro hint explains that a released wish can join the ending.
4. Every wish option is a native keyboard-operable button, identifies its action in the accessible name, and exposes its selected state through `aria-pressed`.
5. Choosing a different wish changes the text shown inside the story's final pearl-paper card in place; it does not restart or alter the three selected story chapters.
6. **Tell another tiny story** resets the selected wish to the latest currently released wish as well as resetting existing story choices and the pet reply.
7. Long custom wishes fit the tested 375px mobile viewport without horizontal overflow. Visible keyboard focus remains clear.
8. No persistence, browser storage, backend, analytics, paid service, extra package, remote asset, new route, or top-level navigation destination is introduced.

**Risk:** R1 (cross-feature data flow into an existing interactive ending).  
**Validation:** Playwright releases two wishes, verifies latest-wish default, changes the selection and checks the rendered story text, checks responsive bounds, and confirms replay restores the latest choice. The existing storybook journey exercises the empty-wish state. Exact PR-head Node/content tests, production build and the full Chromium browser suite are required before merge.

## Evidence standard

Only exact PR-head CI supports promotion to main. Automation does not certify physical-device, human screen-reader, human sound-quality, or production-alias behavior.
