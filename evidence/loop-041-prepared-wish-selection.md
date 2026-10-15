# Loop 041 — Prepared-Wish Selection Consistency

Date: 15 October 2026  
Repository: https://github.com/teyyara/malika  
Candidate branch: `fix/loop-041-prepared-wish-selection`  
Base main checkpoint: `fb607aadfd183bb36f5942732779094fd6fec0cc`  
Requirement: REQ-028 / Product Contract v2.5  
Risk: R1

## Observation

Wish Sky initialized `chosenPreparedId` to the first preset even with an empty textarea. After a preset was chosen, selection was maintained as separate state, so the preset could remain visually and accessibly pressed when the actual draft changed or was cleared after release.

## Intervention

- Derive the selected preset from an exact match between the textarea draft and the preset's text.
- Keep visual `is-selected` styling and `aria-pressed` tied to that derived state.
- Add browser regression assertions that no preset starts selected, a chosen preset marks pressed, custom edits clear selection, and releasing a wish clears it along with the textarea.
- Preserve the actual released wish and wish-count behavior.

## Validation record

- Candidate validation: PASS. PR #55 exact head `3e95ab99b5e9c2498966b51f97cae44f8df74e9a` passed Node/content tests, production build, and all 62 Chromium browser journeys in [workflow 38739679561](https://github.com/teyyara/malika/actions/runs/38739679561).
- Last known-good checkpoint: `fb607aadfd183bb36f5942732779094fd6fec0cc`, with all 62 Chromium browser journeys passing.
- No manual Vercel deployment is initiated; the owner remains responsible for production deployment and live verification.
- Human screen-reader, physical-device, and production-alias checks remain outside automated CI.


## Completed validation

- PR #55 exact head `3e95ab99b5e9c2498966b51f97cae44f8df74e9a` passed Node/content tests, production build, and all 62 Chromium browser journeys in [workflow 38739679561](https://github.com/teyyara/malika/actions/runs/38739679561).
- PR #55 was merged into `main` at `c85852fca289ef6ed65a3734944c1c36e844aea0` after exact-head validation passed.
- Post-merge main workflow [38741098379](https://github.com/teyyara/malika/actions/runs/38741098379) passed Node/content tests, production build, and all 62 Chromium browser journeys.
- No manual Vercel deployment was initiated; production alias verification remains owner-managed.
- Human screen-reader and physical-device QA are not certified by automated tests.
