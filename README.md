# For Malika, With All My Heart 💜

A romantic, interactive birthday experience made by Zack for Malika, whose birthday is **12 October**. Built with React, Vite, and Motion: a connected moonlit universe of a lavender garden, Mimi the kitten, red ladybugs, purple hearts, hidden wishes, and a heart-collection game.

## Run locally

Requirement: Node.js 20.19 or newer.

    npm install
    npm run dev

Open the local URL printed by Vite.

## Automated validation

Run the reducer/content checks and production build:

    npm test
    npm run build

For browser tests:

    npx playwright install chromium
    npm run test:e2e

GitHub Actions installs Chromium's operating-system dependencies, runs the suite against the production build, and retains the Playwright HTML report and rendered screenshots. The merged Loop 007 checkpoint passed **8 Node tests, the Vite production build, and 20 Chromium browser journeys** in [CI run 38247015295](https://github.com/teyyara/malika/actions/runs/38247015295). Journeys include navigation, wrong-move recovery, reset/retry, arcade mastery, keyboard secrets, and a narrow 320px viewport. Loop 008 passed all 21 Chromium browser journeys, 8 Node tests, and the Vite production build; see CI run 38248660014.

## The experience

- **Personal welcome:** an opening written for Malika from Zack.
- **Interactive garden:** pet Mimi, follow fluttering ladybugs, touch a flower for a wish, trace three stars for a heart-shaped constellation, and optionally open the progressive clue guide.
- **Mimi's Little Heart Garden:** collect seven purple hearts; each collectible scores only once, with an animated victory and secret-letter unlock.
- **Love collection:** 30 affectionate notes plus five future-facing little dreams; secret letters unlock at victory.
- **Birthday finale:** a personal letter revealed in a measured sequence and an optional final surprise.

## Personalization

Names, date, welcome copy, game target, and the birthday letter are centralized in `src/data/siteConfig.js`. Edit notes in `src/data/loveMessages.js`. The five entries in `src/data/memories.js` are explicitly imagined future moments, not claims that an event already happened.

The experience has no backend, analytics, paid API, sound dependency, or remote image service. Cat and ladybug artwork is inline SVG. Keyboard focus patterns and reduced-motion support are included.

## Vercel deployment

The Vercel project **malika-birthday** is connected to this repository. The last previously confirmed production deployment is recorded at the [Vercel dashboard](https://vercel.com/tyyr1/malika-birthday/CzGS17bNAaTbaUCH7uLAP7XR6rQv). The Loop 007 production attempt reported failed ([deployment details](https://vercel.com/tyyr1/malika-birthday/GrbCE3RnoKGws4A54c3NvJyoV7TE)). Loop 008's PR preview passed, but the latest main commit has not reported a Vercel status through GitHub and the connected Vercel integration cannot access deployment logs. The latest production release is therefore unverified; treat it as live only after Vercel reports Ready. No access-bypass token is stored in this repository.

Framework: **Vite**, build command `npm run build`, output directory `dist`, root directory `./`, no environment variables.

## Hidden Easter eggs and mini-games

The extra secrets are optional; all core birthday scenes stay available without finding any of them. The garden includes a gentle-to-clear-to-spoiler hint trail that starts closed and only reveals the full map when requested. See [docs/loop-008-gentle-secret-hints.md](docs/loop-008-gentle-secret-hints.md) and the walkthrough in [docs/easter-egg-test-guide.md](docs/easter-egg-test-guide.md). After completing all five games, a mastery bar unlocks the animated **Keeper of Little Wonders** finale; see [docs/loop-006-grand-secret.md](docs/loop-006-grand-secret.md). Browser regression coverage lives in `e2e/easter-eggs.spec.js` and `e2e/birthday.spec.js`.

## Project status and evidence

See `AEOS_STATUS.md`, `.aeos/state.json`, `docs/product-contract-v1.1.md`, and `evidence/loop-004-release.md`, `evidence/loop-005-easter-eggs.md`, and `docs/easter-egg-test-guide.md`. Automated tests pass; screen-reader validation and physical-device touch QA remain separate, unobserved gates.
