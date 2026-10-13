# Loop 031 — A Hundred Little Reasons I Love You

## Scope

The existing birthday letter scene gains an optional, collapsed-by-default book of 100 short authored reasons and reflections. It reveals one page at a time with previous/next controls, a progress indicator, and a restart at the last page.

## Content and state

- The authored dataset is checked for exactly 100 unique, finished entries.
- Wording stays general and affectionate; it does not invent specific shared past events.
- Current page lives in component state only. Leaving the birthday scene unmounts the component and resets it on return.
- No browser storage, server, backend, analytics, external runtime asset, paid service, new package, or remote API is added.

## Validation planned

- Exact PR-head CI must pass Node/content tests, production build, and the complete Chromium browser journeys before merge.
- Browser coverage includes closed-by-default behavior, reading forward/back, the 100th page, restart, state reset after navigation, and 375px viewport fit.
- Manual physical-device and screen-reader testing are not claimed.
- No Vercel deployment is initiated; production-alias status remains with the owner.
