# Product Contract v2.6 — Malika Birthday Universe

Status: Loop 042 candidate — validation pending. Product Contract v2.5 remains the accepted baseline until this change is validated and merged.

## Change request CR-042 — Letter-starter character-limit integrity

**Objective:** prevent optional writing starters from silently cutting off a draft at the 800-character limit.

### REQ-029 — Never truncate user-authored text silently

**Acceptance criteria**

1. Clicking an optional writing starter appends the full starter only when the combined draft fits within the 800-character limit.
2. If the appended starter would exceed the limit, the draft remains unchanged; no part of the existing draft or starter is silently removed.
3. An accessible polite status message explains that more room is needed and how much extra room the starter requires.
4. Editing the draft clears the stale starter warning.
5. When enough room is available, the whole starter is inserted and the warning clears.
6. The normal textarea typing limit, folding, preview, copy behavior, local-only privacy, responsive layout, and keyboard access remain intact.
7. No new package, backend, browser storage, remote asset, paid feature, analytics, or external service is introduced.

**Risk:** R1 data-integrity and editing feedback.

**Validation:** exact PR-head Node/content tests, production build, and Playwright Chromium journeys. New assertions cover rejection without truncation, accessible feedback, and successful insertion when there is enough room. Passing automation does not certify physical-device, human screen-reader, or production-alias behavior.
