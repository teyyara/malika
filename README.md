# For Malika, With All My Heart 💜

A romantic, interactive birthday experience made by Zack for Malika, whose birthday is **12 October**. Built with React, Vite, and Motion: one connected world with a moonlit lavender garden, a gently animated kitten named Mimi, red ladybugs, purple hearts, and a heart-collection game.

## Run locally

Requirement: Node.js 20.19 or newer.

1. Run `npm install`.
2. Run `npm run dev`.
3. Open the local URL printed by Vite.

Use `npm test` for game-state and personalization tests and `npm run build` for a production build. `npm run preview` is a local preview, not a production server.

## The experience

- **Birthday welcome:** a personalized opening for Malika from Zack.
- **Interactive garden:** tap ladybugs to open notes and tap Mimi for a playful birthday greeting.
- **Mimi's Little Heart Garden:** collect seven purple hearts; each collectible scores only once.
- **Love collection:** 30 notes plus five future-facing little dreams; secret letters unlock when the game is won.
- **Birthday finale:** a personal letter from Zack to Malika and an optional final reveal.

## Personalization

All names, date, welcome copy, game target, and birthday letter are centralized in `src/data/siteConfig.js`. Edit notes in `src/data/loveMessages.js`. The five ideas in `src/data/memories.js` are explicitly imagined future moments, not claims that an event has already happened.

The project has no backend, analytics, paid API, sound dependency, or external runtime image service. Custom cat/ladybug art is inline SVG. Keyboard focus patterns and reduced-motion support are included.

## Validation and project state

See `AEOS_STATUS.md`, `.aeos/state.json`, `docs/product-contract-v1.1.md`, and `evidence/`. GitHub Actions runs dependency installation, Node tests, and the Vite production build. Visual browser QA and deployment are separate gates; no live URL is claimed yet.
