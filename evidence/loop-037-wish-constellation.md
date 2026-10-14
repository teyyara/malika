# Loop 037 — The Wish Sky Becomes a Constellation

## Scope

Two or more released wishes are now linked by a subtle decorative SVG line, giving the existing sky the feeling of one growing constellation. The original star positions, selected wish text and release interactions remain untouched.

## Constraints

- Trace appears only with at least two wishes and follows their existing ordered positions.
- One SVG polyline is placed behind the star buttons; no interactive event handler is added.
- SVG uses `aria-hidden="true"` and `focusable="false"`; CSS disables pointer hit testing.
- No new animation, state, package, asset, backend, browser storage, paid service or outside API.
- Reduced-motion preference requires no special extra behavior because the line remains still.

## Validation results

- Exact PR-head workflow 38643157760 passed on `3a0ebc4662e8920a6d196bcb7a111a8227975391`.
- Post-merge main workflow 38645157634 passed on merge commit `5b86e56ef2c2ef03beec934144d130a5212aac6d`.
- Both runs passed Node/content tests, the production build, and all **60 Chromium browser journeys**.
- Browser coverage verifies trace absence with zero/one wish, one polyline with three wishes, the SVG accessibility attributes, working star selection, and layout bounds at 1366px and 375px.
- No local build/test or manual Vercel deployment is claimed. Production-alias status, human screen-reader behavior, and physical-device QA remain unverified.
