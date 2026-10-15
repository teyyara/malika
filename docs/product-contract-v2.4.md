# Product Contract v2.4 — Malika Birthday Universe

Status: ACCEPTED — Loop 040 merged and validated in PR #54 at df18310c616af7c418a9930ead7e889cb84df900. Product Contract v2.4 is now the accepted baseline for REQ-027; previously accepted requirements remain in force.

## Change request CR-040 — Contextual hints inside the Secret Arcade

**Objective:** keep game feedback with the active puzzle and reserve the global discovery toast for genuine discoveries outside the games.

### REQ-027 — Inline arcade hints without navigation side effects

**Acceptance criteria**

1. Incorrect selections in constellation chase, firefly hunt, Pawprint Rhythm, and the wish jar display a readable hint within the active game dialog.
2. Wrong moves do not open the global discovery toast or expose the unrelated “Open Secret Arcade” action while the player is already in a game.
3. In-game hint feedback uses a polite live region and remains visually readable on small screens.
4. The hint is cleared when the player resumes correct play, replays the rhythm cue, starts another game, leaves/closes the arcade, or completes a quest.
5. The original clue text and recovery instructions remain specific to the current puzzle. Wrong moves do not change score or progress unless the original game rule already resets a combo.
6. Genuine hidden discoveries, such as the four-ladybug discovery, retain their global toast and “Open Secret Arcade” action.
7. Existing scoring, game rules, animation preferences, keyboard operation, local-only architecture, and game sound behavior remain intact.
8. No dependency, paid feature, backend, browser storage, remote asset, analytics, or external service is introduced.

**Risk:** R1 in-game feedback and navigation behavior.

**Validation:** exact PR-head Node/content tests, production build, and Playwright Chromium journeys. New assertions prove wrong answers stay in the active game, no discovery toast appears, hints clear on recovery, and discovery toasts still work for actual discoveries. Passing automation does not certify human screen-reader behavior, physical devices, subjective sound quality, or the production alias.


## Validation record — Loop 040

- Exact PR-head workflow [38736617748](https://github.com/teyyara/malika/actions/runs/38736617748): PASS — Node/content tests, production build, and 62 Chromium browser journeys.
- Post-merge main workflow [38737299677](https://github.com/teyyara/malika/actions/runs/38737299677): PASS — Node/content tests, production build, and 62 Chromium browser journeys.
- Merge commit: `df18310c616af7c418a9930ead7e889cb84df900`.
- Deployment and production alias: owner-managed; no manual Vercel deployment was initiated.
