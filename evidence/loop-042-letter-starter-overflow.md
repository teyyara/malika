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

- Candidate validation: PASS. PR #56 exact head `4c7f821b319465943fdcf88d01a145d1f25032b0` passed Node/content tests, production build, and all 63 Chromium browser journeys in [workflow 38744336958](https://github.com/teyyara/malika/actions/runs/38744336958).
- Last known-good checkpoint: `7ea17568ae1e2b87ed251d0922700d140195265f`, with all 62 Chromium browser journeys passing.
- No manual Vercel deployment is initiated; production deployment and live verification remain owner-managed.
- Human screen-reader, physical-device, and production-alias checks remain outside automated CI.


## Completed validation

- The initial run `38743497248` caught an over-escaped newline assertion in the newly added E2E test. The assertion was corrected to test an actual blank line.
- Updated PR #56 exact head `4c7f821b319465943fdcf88d01a145d1f25032b0` passed Node/content tests, production build, and all 63 Chromium browser journeys in [workflow 38744336958](https://github.com/teyyara/malika/actions/runs/38744336958).
- PR #56 was merged into `main` at `cc026a3db7a82ed0bc69c2ecb5e34f5634121664` after exact-head validation passed.
- Post-merge main workflow [38745052150](https://github.com/teyyara/malika/actions/runs/38745052150) passed Node/content tests, production build, and all 63 Chromium browser journeys.
- No manual Vercel deployment was initiated; production alias verification remains owner-managed.
- Human screen-reader and physical-device QA are not certified by automated tests.
