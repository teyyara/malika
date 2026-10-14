# Loop 037 — The Wish Sky Becomes a Constellation

## Scope

Two or more released wishes are now linked by a subtle decorative SVG line, giving the existing sky the feeling of one growing constellation. The original star positions, selected wish text and release interactions remain untouched.

## Constraints

- Trace appears only with at least two wishes and follows their existing ordered positions.
- One SVG polyline is placed behind the star buttons; no interactive event handler is added.
- SVG uses `aria-hidden="true"` and `focusable="false"`; CSS disables pointer hit testing.
- No new animation, state, package, asset, backend, browser storage, paid service or outside API.
- Reduced-motion preference requires no special extra behavior because the line remains still.

## Validation plan

- Exact final PR-head CI must pass Node/content tests, the production build and the full Chromium browser suite.
- New Playwright coverage verifies trace visibility at zero/one/three wishes, point count, accessibility attributes, selection still works, and 1366px/375px bounds.
- Main post-merge CI must also pass. No manual Vercel deployment will be initiated; public production alias, human screen-reader and physical-device behavior remain unverified.
