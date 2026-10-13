# Product Contract v1.7 — Malika Birthday Universe

Status: Loop 033 merged and validated on 13 October 2026. Product Contract v1.6 remains the prior baseline; this version makes Mimi's existing recorded cat voice more consistent with her love-language actions.

## Change request CR-033 — Mimi's Vocal Personality

**Objective:** keep feline vocal responses recognizably feline by using the site's existing locally bundled recordings for interactions that portray Mimi vocalizing.

### REQ-020 — Recorded voices for Mimi's love language

**Acceptance criteria**

1. The “A cuddle” and “Cozy nap” actions continue to play the locally bundled purr recording.
2. “Play with ribbon” plays a locally bundled recorded meow alongside its playful dance cue.
3. “Tell her a secret” plays the recorded purr, not a synthesized musical “love” chord. The visible slow-blink response and live message remain.
4. The site's existing sound mixer and master mute apply to the real animal recordings. Muting during an active voice stops it promptly.
5. The browser regression must observe actual Web Audio buffer-source starts and recognize the meow/purr asset by recorded buffer duration; it must not pass by checking only a label, class, or text.
6. No new remote audio request, audio asset, dependency, browser storage, backend, analytics, paid API, or third-party runtime service is introduced.
7. Existing sound controls, reduced-motion support, companion tabs, and core birthday journeys remain unchanged.

**Risk:** R1 (action-specific audio cue adjustment in the existing companion studio).  
**Validation:** Node/content tests and production build plus the full Chromium suite, including a Playwright test for meow/purr buffers and mute interruption. Exact PR-head CI is the merge gate.

## Evidence standard

Only exact PR-head CI supports promotion to main. Passing automation does not certify human sound-quality judgement, physical-device behavior, human screen-reader behavior, or production-alias behavior.


## REQ-020 validation record

**Validated:** exact PR-head workflow [38476623426](https://github.com/teyyara/malika/actions/runs/38476623426) on `9d35c118f24e687101760c4f0c3226794bc00244` and post-merge main workflow [38477205346](https://github.com/teyyara/malika/actions/runs/38477205346) on merge `01b47ae4c8f5c0bfe6b37954b857b258936f6702` passed Node/content tests, the production build, and all **57 Chromium browser journeys**. The voice regression verified meow and purr buffer playback and master mute interruption.

Human sound-quality judgement, physical-device behavior, human screen-reader behavior, and production-alias behavior are not certified by these automated runs.
