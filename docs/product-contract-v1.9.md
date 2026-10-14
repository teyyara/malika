# Product Contract v1.9 — Malika Birthday Universe

Status: Loop 035 merged and validated on 14 October 2026. Product Contract v1.8 remains the preceding baseline; this change makes Mimi's existing storybook feel more tactile without adding assets or navigation.

## Change request CR-035 — The Storybook That Plays Along

**Objective:** animate chapter and phase changes as gentle page turns, let the illustrated garden respond to story progress, and add short local sound cues at meaningful moments.

### REQ-022 — Sensory feedback for Mimi's Tiny Storybook

The existing storybook must make progression, choices, and the final reveal feel responsive while respecting the visitor's motion and sound preferences.

**Acceptance criteria**
1. The introduction, each chapter, and the final story enter through the same restrained page transition. Changing chapter keys causes a new page entrance without breaking the current choice or navigation behavior.
2. The transition reads useReducedMotion; reduced-motion mode skips the entrance animation and keeps the transition duration effectively at zero.
3. The illustration changes subtle lighting at chapter two, chapter three, and the ending; decorative changes remain hidden from assistive technology.
4. Short sound cues use the existing playCuteSound melodies on story start, a newly changed choice, next chapter, previous chapter, the final reveal, and replay. They are synthesized by the existing Web Audio sound system—not loaded from a new file.
5. Sound playback still respects the site's existing sound toggle, volume, and visibility rules; replay does not force sound back on.
6. Existing keyboard navigation, aria-pressed choices, progress status, choice invalidation when backtracking, composed ending, live kitten response, and replay reset remain unchanged.
7. No new scene, dependency, audio file, remote asset, backend, analytics, browser storage, paid feature, or external service is introduced.
8. The browser test verifies the reduced-motion state, phase/chapter transitions, and that story cues reach the existing Web Audio tone path. The complete browser suite and production build must pass on the exact PR head before merge.

**Risk:** R1 (animation/audio additions inside an existing interactive component).  
**Validation:** Playwright asserts phase/chapter state, reduced-motion mode, sound cue oscillator activity on story start and a changed choice, all prior branching behavior, and 375px layout. CI must also pass Node/content tests, the production build, and all existing Chromium journeys.

**Validation completed:** exact final PR-head workflow [38485047179](https://github.com/teyyara/malika/actions/runs/38485047179) on `ab0ddc8ce7b10dc8905cc7685fc227b945b499a6` and post-merge main workflow [38485545190](https://github.com/teyyara/malika/actions/runs/38485545190) on merge `3c7bba4a9bcaffcaeeaff65faf63bedeae1052a3` both passed Node/content tests, production build, and all 58 Chromium browser journeys.

## Evidence standard

Only exact PR-head CI supports promotion to main. Automated tone-path checks do not substitute for human listening, physical-device testing, screen-reader QA, or production-alias verification.
