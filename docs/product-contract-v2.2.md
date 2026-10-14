# Product Contract v2.2 — Malika Birthday Universe

Status: Loop 038 change request implemented on a feature branch on 14 October 2026. Product Contract v2.1 remains the baseline for Loop 037; this version adds an explicit way to copy the fairytale created in Mimi's Tiny Storybook.

## Change request CR-038 — Take This Little Story With You

**Objective:** let Malika copy the story she shaped so she can keep or share it herself, without building a submission, storage, or sending feature.

### REQ-025 — Copyable fairytale with manual fallback

The storybook ending must offer an explicit copy action for the fairytale currently shown.

**Acceptance criteria**
1. The copy action appears only after a complete story ending is rendered, within the existing companion tab. It creates no new navigation destination.
2. The copied plain text includes the title, each of the three chosen story passages, the final choice's ending, the established sign-off, and the currently selected sky wish when one is present. Unchosen passages are omitted.
3. The UI confirms a successful copy only after `navigator.clipboard.writeText` resolves.
4. If the clipboard API is absent or its write fails, the UI reports that automatic copy is unavailable and provides a labelled, read-only text area containing the same complete story, with a simple way to select the text for manual copying.
5. Changing the selected sky wish clears stale copy feedback and fallback state. The next copy contains the currently selected wish.
6. **Tell another tiny story** clears copy feedback and fallback UI while resetting the storybook to its initial phase.
7. The action, status message and fallback are keyboard-accessible, have visible focus styling, and fit the 375px phone viewport without horizontal overflow. Existing reduced-motion support is unchanged.
8. Copying is a user-triggered local clipboard operation. The site does not transmit or persist story text.
9. No new package, browser storage, backend, account, analytics, paid API, remote asset or third-party service is introduced.

**Risk:** R1 (clipboard interaction and failure fallback inside the existing storybook).
**Validation:** Node tests cover composed text including/omitting the optional wish and incomplete paths. Playwright verifies exact selected-path text, optional wish inclusion, successful clipboard feedback, rejected-write fallback and full-text selection, reset on replay, and 375px layout. Node/content tests, production build, and the full Chromium journey suite must pass on the exact final PR head before merge.

## Evidence standard

Only exact PR-head CI supports promotion to main. Automated browser results do not certify physical-device, human screen-reader, or production-alias behavior.
