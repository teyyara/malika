# Loop 030 — A Little Letter Back

## Scope

A private note composer sits inside the existing Love Notes page. Malika can draft a message, optionally append a suggested opening, preview it as a letter to Zack, return to editing without losing the draft, and copy it through the browser clipboard where supported.

## Data and privacy

- Draft lives in local React component state only.
- No form submission or network request is created by the composer.
- No browser storage, server, backend, analytics, paid feature, dependency, or remote asset is added.
- The UI explicitly says the note is neither sent nor saved and is cleared on refresh.
- Copying is an explicit, user-initiated action. If the browser blocks clipboard access, the text remains visible for manual selection/copying.

## Validation planned

- Exact PR-head CI must pass Node/content tests, production build, and complete Chromium browser journeys before merge.
- Added browser coverage for optional starter prompts, empty guard, 800-character counter, preview/edit preservation, clipboard success/fallback, and mobile fit.
- Local build/test is not claimed because this execution environment cannot clone the repository.
- No Vercel deployment is initiated and production alias status remains with the owner.
