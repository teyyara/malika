# Malika — A Little Universe Made for You

A romantic, interactive birthday experience built with React, Vite, and Motion. One continuous world connects the welcome, garden, heart game, love collection, and birthday finale.

## Quick start

Requirement: Node.js 20.19 or newer.

1. Run npm install.
2. Run npm run dev.
3. Open the local URL printed by Vite.

Use npm test for game-state tests and npm run build for a production build. npm run preview is a local preview, not a production server.

## Personalization

Edit src/data/siteConfig.js for optional names, headings, the game goal, and birthday letter. Edit src/data/loveMessages.js to change notes. Add only genuine, user-approved shared memories to src/data/memories.js; the app intentionally contains no invented relationship events.

The project defaults to English based on the supplied brief. No external services, paid APIs, backend, tracking, or audio are needed for the core experience.

See AEOS_STATUS.md, .aeos/state.json, the versioned product contract, and evidence/ for the checkpoint and what has or has not been validated. GitHub Actions runs the unit tests and production build. No deployment is configured or claimed yet.
