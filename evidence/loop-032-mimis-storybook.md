# Loop 032 — Mimi's Tiny Storybook

## Scope

The existing garden companion studio gets a fifth tab: an original fairytale in which Malika chooses how Mimi starts, solves a small puzzle, and what gift appears in the envelope. Three authored choices compose the ending, so the experience is replayable and responds to her decisions.

## Content and state

- Three chapters contain three options each; every option has a distinct ID, short detail, narrative passage, and the final chapter's choice also contains an ending paragraph.
- The story explicitly says it is fictional and does not present made-up events as a memory.
- Selecting a choice marks it with `aria-pressed`; a progress indicator tracks choices made.
- Changing a prior answer clears later answers. Leaving the tab unmounts the component and resets the story.
- Uses existing CatCharacter and Ladybug artwork. No additional dependency, browser storage, backend, analytics, paid service, remote asset, or outside API is added.

## Validation planned

- Exact PR-head CI must pass Node/content tests, production build, and the full Chromium browser journey suite before merge.
- Browser coverage includes story composition from selected passages, progress, backtracking invalidation, replay reset, reduced motion, and 375px viewport bounds.
- Local build/test is not claimed because the execution environment could not clone the repository; CI is the validation gate.
- No Vercel deployment is initiated. Production-alias status remains with the owner.
