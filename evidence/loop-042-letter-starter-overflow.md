# Loop 042 — Letter-Starter Character-Limit Integrity

Date: 15 October 2026  
Repository: https://github.com/teyyara/malika  
Candidate branch: `fix/loop-042-letter-starter-overflow`  
Base main checkpoint: `7ea17568ae1e2b87ed251d0922700d140195265f`  
Requirement: REQ-029 / Product Contract v2.6  
Risk: R1

## Observation

In `LetterBackComposer`, adding an optional writing starter to an existing draft used `slice(0, 800)`. When the draft was close to its 800-character limit, the button could silently truncate the existing draft and insert only part of the starter.

## Intervention

- Compose the candidate draft without mutating the current text.
- If it exceeds the 800-character limit, leave the current draft untouched and show a polite, accessible message describing how much space is needed.
- Clear the warning once the draft is edited or a starter is successfully inserted.
- Add an end-to-end test that proves a near-limit draft stays byte-for-byte unchanged on failure and that insertion succeeds when there is enough room.

## Validation record

- Candidate validation: PENDING — exact PR-head Node/content tests, production build, and full Chromium browser journeys must pass before merge.
- Last known-good checkpoint: `7ea17568ae1e2b87ed251d0922700d140195265f`, with all 62 Chromium browser journeys passing.
- No manual Vercel deployment is initiated; production deployment and live verification remain owner-managed.
- Human screen-reader, physical-device, and production-alias checks remain outside automated CI.
