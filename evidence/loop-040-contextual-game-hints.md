# Loop 040 — Contextual Arcade Hints

Date: 15 October 2026  
Repository: https://github.com/teyyara/malika  
Candidate branch: `fix/loop-040-contextual-game-hints`  
Base application checkpoint: `ed281d9986b1c1c9b7ad74add68c29282b2ea5ff`  
Requirement: REQ-027 / Product Contract v2.4  
Risk: R1

## Observation

The global `announce()` handler served both discovery events and incorrect game actions. It displayed a toast containing an “Open Secret Arcade” button even inside the Arcade. That action called `openArcade("firefly-trail")`, which moved the player out of the current puzzle to the cabinet instead of helping them recover from a wrong move.

## Intervention

- Split genuine discovery notifications from contextual game hints.
- Render wrong-answer guidance inside each active game as a polite live region, with a compact responsive style.
- Clear old hints when a correct move resumes play, when the rhythm cue is replayed, when a game is started/left, and when a quest is completed.
- Keep the global discovery toast intact for genuine outside discoveries such as the four-ladybug secret.
- Add browser assertions for constellation, rhythm, firefly, and wish-jar hints; ensure no global toast/navigation action appears on a wrong game move; verify that correct moves/replay clear the feedback; retain the discovery-toast regression test.

## Validation record

- Candidate validation: PASS. PR #54 exact head `7452fd181901405d1cd80aa144833cf84fbacb2d` passed Node/content tests, production build, and all 62 Chromium browser journeys in [workflow 38736617748](https://github.com/teyyara/malika/actions/runs/38736617748).
- Last known-good application checkpoint: `ed281d9986b1c1c9b7ad74add68c29282b2ea5ff`.
- No manual Vercel deployment is initiated; the owner remains responsible for production deployment and live verification.
- Human screen-reader, physical-device, and subjective audio QA remain separate from automated checks.


## Completed validation

- Initial run `38735796374` exposed two outdated E2E assertions that still expected a global toast for game errors. The assertions were corrected to expect contextual hints and retry behavior.
- Updated PR #54 head `7452fd181901405d1cd80aa144833cf84fbacb2d` passed Node/content tests, production build, and 62 Chromium browser journeys in [workflow 38736617748](https://github.com/teyyara/malika/actions/runs/38736617748).
- PR #54 was merged into `main` at `df18310c616af7c418a9930ead7e889cb84df900` after exact-head validation passed.
- Post-merge main workflow [38737299677](https://github.com/teyyara/malika/actions/runs/38737299677) passed Node/content tests, production build, and all 62 Chromium browser journeys.
- No manual Vercel deployment was initiated; production alias verification remains owner-managed.
