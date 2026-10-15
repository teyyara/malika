# Product Contract v2.3 — Malika Birthday Universe

Status: ACCEPTED — Loop 039 merged and validated in PR #53 at 79febb97bbfa69f65e6ce190f1a87c76c7fd1cd3. Product Contract v2.3 is now the accepted baseline for REQ-026; previously accepted requirements remain in force.

## Change request CR-039 — Arcade reactions and cues have a clean lifecycle

**Objective:** make Mimi's game reactions informative but temporary, and ensure timed rhythm cues stop when the player leaves or changes the arcade scene.

### REQ-026 — Transient companion feedback and cancellable rhythm playback

**Acceptance criteria**

1. A wrong game action makes Mimi visibly surprised and starts a short-lived reaction; she returns to her curious baseline if no newer action replaces it.
2. A correct non-winning action makes Mimi visibly delighted or warm, then returns to curious. A newer action replaces the prior pending reaction reset so a stale timer cannot override the newer state.
3. A completed game remains celebratory while its victory screen is open; the transient timer must not reset that reward mood.
4. Starting or leaving a game cancels any previous timed rhythm playback. Returning to the arcade during a rhythm preview immediately restores usable controls and no prior cue may continue advancing in the background.
5. Leaving, closing, or switching the active arcade scene cleans up pending rhythm timers. Starting another rhythm game begins at its own first cue and clean initial state.
6. Existing scoring, puzzles, hints, retry behavior, keyboard controls, and reduced-motion support remain intact.
7. No dependency, paid feature, backend, browser storage, analytics, remote asset, or external service is introduced.

**Risk:** R1 timed UI/game-state behavior.

**Validation:** exact PR-head Node/content tests, production build, and Playwright Chromium browser journeys. New browser assertions cover the timed return to curiosity, successful reactions after a wrong move, and leaving/reopening Pawprint Rhythm while the preview is in progress. Passing automation does not certify physical-device, human screen-reader, sound-quality, or production-alias behavior.


## Validation record — Loop 039

- Exact PR-head workflow [38733162968](https://github.com/teyyara/malika/actions/runs/38733162968): PASS — Node/content tests, production build, and 62 Chromium browser journeys.
- Post-merge main workflow [38733810002](https://github.com/teyyara/malika/actions/runs/38733810002): PASS — Node/content tests, production build, and 62 Chromium browser journeys.
- Merge commit: `79febb97bbfa69f65e6ce190f1a87c76c7fd1cd3`.
- Deployment / production alias: not manually deployed or certified by these checks; owner-managed.
