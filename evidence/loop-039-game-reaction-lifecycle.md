# Loop 039 — Timed Arcade Reaction Lifecycle

Date: 15 October 2026  
Repository: https://github.com/teyyara/malika  
Candidate branch: `fix/loop-039-game-reaction-lifecycle`  
Base application checkpoint: `34ed6280c9f0d5551c81a9952a8075fc7194b20e`  
Requirement: REQ-026 / Product Contract v2.3  
Risk: R1

## Observation

Loop 038 made Mimi react to mistakes and correct answers, but an arcade reaction could remain set indefinitely. The six-beat rhythm also relies on scheduled browser timers; those cues need to be cancelled when the user leaves the active game so a hidden sequence does not continue behind another panel.

## Intervention

- Give wrong and correct game responses a short-lived mood, with a reset to curiosity.
- Cancel the older mood timeout whenever another reaction replaces it. The victory mood persists while the celebration remains open.
- Stop and clear rhythm playback when the player exits or changes the active arcade scene.
- Add regression coverage for temporary wrong/correct reactions and leaving/reopening Pawprint Rhythm during its cue playback.
- Preserve existing puzzle rules, audio assets, retry mechanics and reduced-motion support. No new service or dependency is introduced.

## Validation record

- Candidate validation: PENDING — exact PR-head Node/content tests, production build, and all Chromium journeys must pass before merge.
- Last known-good application checkpoint: `34ed6280c9f0d5551c81a9952a8075fc7194b20e`.
- No Vercel deployment is initiated. The owner remains responsible for deployment and live production verification.
- Human screen-reader, physical-device and subjective audio QA remain separate from automated checks.
