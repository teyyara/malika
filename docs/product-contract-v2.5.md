# Product Contract v2.5 — Malika Birthday Universe

Status: ACCEPTED — Loop 041 merged and validated in PR #55 at c85852fca289ef6ed65a3734944c1c36e844aea0. Product Contract v2.5 is now the accepted baseline for REQ-028; previously accepted requirements remain in force.

## Change request CR-041 — Prepared-wish selection reflects the current draft

**Objective:** keep the Wish Sky prepared-preset highlight, accessible pressed state, and textarea content coherent.

### REQ-028 — Truthful prepared-wish selection state

**Acceptance criteria**

1. No prepared wish appears selected while the textarea is empty on first opening Wish Sky.
2. Selecting a prepared wish fills the textarea and marks exactly that preset as selected.
3. Editing the textarea so it no longer exactly matches a prepared preset clears the selected indication and sets all prepared buttons to `aria-pressed="false"`.
4. Replacing custom text with a prepared wish reselects the matching preset because the displayed draft now matches that text.
5. Releasing a wish clears the textarea and consequently clears all prepared preset selection states.
6. The released wish remains available as a star and in the wish collection; only preset-selection presentation changes.
7. Existing wish composition, selection, count, responsive layout, local-only behavior, and keyboard controls remain intact.
8. No dependency, paid feature, backend, browser storage, remote asset, analytics, or external service is introduced.

**Risk:** R1 interaction-state coherence.

**Validation:** exact PR-head Node/content tests, production build, and Playwright Chromium journeys. New assertions cover initial, selected, custom-edited, and released states. Passing automation does not certify physical-device, human screen-reader, or production-alias behavior.


## Validation record — Loop 041

- Exact PR-head workflow [38739679561](https://github.com/teyyara/malika/actions/runs/38739679561): PASS — Node/content tests, production build, and 62 Chromium browser journeys.
- Post-merge main workflow [38741098379](https://github.com/teyyara/malika/actions/runs/38741098379): PASS — Node/content tests, production build, and 62 Chromium browser journeys.
- Merge commit: `c85852fca289ef6ed65a3734944c1c36e844aea0`.
- Deployment / production alias: not manually deployed or certified by these checks; owner-managed.
