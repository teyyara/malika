# For Malika, With All My Heart 💜

A romantic, interactive birthday experience made by Zack for Malika, whose birthday is **12 October**. Built with React, Vite, and Motion: one connected world with a moonlit lavender garden, a gently animated kitten named Mimi, red ladybugs, purple hearts, and a heart-collection game.

## Run locally

Requirement: Node.js 20.19 or newer.

    npm install
    npm run dev

Open the local URL printed by Vite. Use a separate terminal for validation.

## Automated validation

Run the reducer/content checks and production build:

    npm test
    npm run build

The browser suite uses Playwright and Chromium against the built production preview. Install Chromium once, then run the browser tests:

    npx playwright install chromium
    npm run test:e2e

GitHub Actions installs Chromium's operating-system dependencies automatically and stores the Playwright HTML report as a workflow artifact. The browser suite covers keyboard entry/navigation, the complete heart-collection unlock path, modal close/focus behavior, reduced-motion preference, and horizontal overflow at 320px, 375px, and 768px. These automated checks improve confidence but do not replace a human screen-reader or physical-device review.

## The experience

- **Birthday welcome:** a personalized opening for Malika from Zack.
- **Interactive garden:** tap ladybugs to open notes and tap Mimi for a playful birthday greeting.
- **Mimi's Little Heart Garden:** collect seven purple hearts; each collectible scores only once.
- **Love collection:** 30 notes plus five future-facing little dreams; secret letters unlock when the game is won.
- **Birthday finale:** a personal letter from Zack to Malika and an optional final reveal.

## Personalization

All names, date, welcome copy, game target, and birthday letter are centralized in src/data/siteConfig.js. Edit notes in src/data/loveMessages.js. The five ideas in src/data/memories.js are explicitly imagined future moments, not claims that an event has already happened.

The project has no backend, analytics, paid API, sound dependency, or external runtime image service. Custom cat/ladybug art is inline SVG. Keyboard focus patterns and reduced-motion support are included.

## Validation and project state

See AEOS_STATUS.md, .aeos/state.json, docs/product-contract-v1.1.md, and evidence/. GitHub Actions runs dependency installation, Node tests, a Vite production build, and Chromium browser checks. Visual review by a person, physical-device touch QA, screen-reader QA, and deployment are separate gates; no live URL is claimed.
