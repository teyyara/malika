# Loop 003 Evidence — Browser QA Gate

Date: 2026-10-12  
Candidate: `malika-birthday-003-browser-qa`  
Validated application/workflow checkpoint: `e54e4760f5c3ad4d5434fe275dad9a894cbe9000`  
Progression branch: `aeos/progression`  
Assessment branch: `main`  
Pull request: https://github.com/teyyara/malika/pull/1 (merged)

## Reconciled baseline

At the start of this loop, `main` and `aeos/progression` were identical at `3500c67226e419f073923518645fd0abf73af833`. The prior run at that checkpoint passed dependency installation, eight Node tests, and the Vite production build, but it did not cover real browser interactions.

## Changes in this loop

- Added pinned `@playwright/test@1.64.0` and the `npm run test:e2e` command.
- Added `playwright.config.js` to test the built production preview in Chromium, serialize execution in CI, retain traces/screenshots on failure, and publish an HTML report.
- Added four browser specifications in `e2e/birthday.spec.js`:
  1. Keyboard-first entry, visible navigation through the scenes, and absence of page runtime errors.
  2. Collecting seven hearts, unlocking a secret note, modal focus cycling, Escape close, and focus restoration.
  3. No horizontal overflow at 320px, 375px, and 768px across welcome, garden, game, collection, and finale.
  4. Reduced-motion preference is applied to the application shell.
- Updated `.github/workflows/validate.yml` to install Chromium and OS dependencies, run browser tests after build, and upload the HTML report.
- Updated README, project state, capability manifest, and status.

## Observed validation evidence

Workflow run: https://github.com/teyyara/malika/actions/runs/38186715386  
Validated head SHA: `e54e4760f5c3ad4d5434fe275dad9a894cbe9000`  
Final workflow result: **success**

- Dependency installation: PASS.
- Existing Node tests: **8 passed, 0 failed**.
- Vite production build: PASS.
- Chromium browser tests: **4 passed, 0 failed** (12.8 seconds reported by Playwright).
- Browser test report artifact: https://github.com/teyyara/malika/actions/runs/38186715386/artifacts/11719981697
- Report artifact ID: `11719981697`; uploaded successfully.

The workflow was run against the source/workflow candidate before this post-validation evidence/status update. The updates after that passing run change repository documentation/state only, not the app or test code.

## Promotion evidence

- The exact candidate checkpoint `e54e4760f5c3ad4d5434fe275dad9a894cbe9000` was fast-forwarded to `main`, with expected prior SHA `3500c67226e419f073923518645fd0abf73af833`.
- GitHub confirmed PR #1 was merged.
- A follow-up branch comparison confirmed `main` and `aeos/progression` were identical at the promoted checkpoint immediately after promotion.

## Remaining quality gates

This is a successful automated validation checkpoint, not full release certification. A physical phone/tablet test, manual visual review, screen-reader testing, and deployment have not been observed or configured. No live URL is claimed.
