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

GitHub Actions installs Chromium's operating-system dependencies, runs the suite against the production build, and retains both the Playwright HTML report and rendered screenshot evidence. The final Loop 004 checkpoint passed **8 Node tests and 7 Chromium browser tests**, plus the Vite production build. The browser suite covers navigation, the heart-game unlock path, modal focus/Escape handling, responsive overflow at 320/375/768px, reduced motion, Mimi's reactions, the garden constellation, pointer-responsive ambience, and a six-frame visual-capture journey.

## The experience

- **Personal welcome:** an opening written for Malika from Zack.
- **Interactive garden:** pet Mimi, follow fluttering ladybugs, touch a flower for a wish, and trace three stars to reveal a heart-shaped constellation.
- **Mimi's Little Heart Garden:** collect seven purple hearts; each collectible scores only once, with an animated victory and secret-letter unlock.
- **Love collection:** 30 affectionate notes plus five future-facing little dreams; secret letters unlock at victory.
- **Birthday finale:** a personal letter revealed in a measured sequence and an optional final surprise.

## Personalization

Names, date, welcome copy, game target, and the birthday letter are centralized in `src/data/siteConfig.js`. Edit notes in `src/data/loveMessages.js`. The five entries in `src/data/memories.js` are explicitly imagined future moments, not claims that an event already happened.

The experience has no backend, analytics, paid API, sound dependency, or remote image service. Cat and ladybug artwork is inline SVG. Keyboard focus patterns and reduced-motion support are included.

## Vercel deployment

The Vercel project **malika-birthday** is connected to this GitHub repository. The validated application checkpoint is deployed to `main` with Vercel reporting **Ready**. A branch preview is also **Ready**:

**Preview URL:** https://malika-birthday-git-aeos-progression-tyyr1.vercel.app

Vercel reports SSO protection on Vercel-hosted domains, so a plain URL may ask the reviewer to authenticate. A time-limited shareable bypass link was generated for the intended reviewer on 12 October 2026; the secret is intentionally not committed to this repository. Use the private bypass link supplied by the release operator if the reviewer cannot authenticate. The production deployment's verified aliases are `malika-birthday-kappa.vercel.app`, `malika-birthday-tyyr1.vercel.app`, and `malika-birthday-git-main-tyyr1.vercel.app`. See [docs/vercel-deployment.md](docs/vercel-deployment.md) for deployment evidence and verification steps.

Vercel settings: Framework **Vite**, build command `npm run build`, output directory `dist`, root directory `./`, no environment variables. A custom `vercel.json` is unnecessary because scene changes stay inside React at the root path.

## Project status and evidence

See `AEOS_STATUS.md`, `.aeos/state.json`, `docs/product-contract-v1.1.md`, and `evidence/loop-004-release.md`. Automated tests pass; screen-reader validation and physical-device touch QA remain separate, unobserved gates.
