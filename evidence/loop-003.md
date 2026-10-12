# Loop 003 Evidence — Browser QA Gate

Date: 2026-10-12  
Candidate: `malika-birthday-003-browser-qa`  
Progression branch: `aeos/progression`  
Assessment branch: `main`  
Pull request: https://github.com/teyyara/malika/pull/1

## Reconciled baseline

- Before this loop, `main` and `aeos/progression` were identical at `3500c67226e419f073923518645fd0abf73af833`.
- The last observed passing Actions run on that baseline was https://github.com/teyyara/malika/actions/runs/38186209651. Dependency install, the existing eight Node tests, and the Vite production build passed.
- That run predates the new browser suite and is not evidence that Loop 003 passes.

## Changes in this loop

- Added pinned `@playwright/test@1.64.0` and the `npm run test:e2e` command.
- Added `playwright.config.js` to exercise the built production preview with Chromium, serial execution in CI, trace/screenshot retention on failure, and an HTML report.
- Added four browser specifications in `e2e/birthday.spec.js`: keyboard-first entry and navigation across the scenes; seven-heart game completion and secret-note/modal keyboard flow; horizontal-overflow detection at 320px, 375px, and 768px across the five main scenes; reduced-motion preference and runtime-error checks.
- Updated `.github/workflows/validate.yml` to install Chromium and OS dependencies, run the browser suite after build, and upload the Playwright HTML report.
- Updated README run/test instructions.

## Evidence classification

**Observed:** code and workflow changes are present on `aeos/progression`; pull request #1 is open against `main`; the prior main baseline remains the last known-good promotion checkpoint.

**Not observed:** a passing or failing Actions result for the Loop 003 candidate; browser run output/report; manual visual review; physical-device behavior; screen-reader behavior.

The GitHub connector returned no workflow-run records for the candidate and no usable status for the new run. This is a result-visibility limitation, not a passing result and not evidence of a test failure.

## Promotion decision

**HOLD — DO NOT PROMOTE.** Keep `main` at `3500c67226e419f073923518645fd0abf73af833` until the exact Loop 003 candidate is verifiably green. If CI reports failures, repair the smallest responsible cause and rerun. Even after CI passes, manual visual, device, and screen-reader checks remain separate release gates. No deployment was attempted and no live URL is claimed.
