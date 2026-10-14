# Product Contract v2.1 — Malika Birthday Universe

Status: Loop 037 change request implemented on a feature branch on 14 October 2026. Product Contract v2.0 is the preceding baseline; this change gives the existing Wish sky a quiet, connected constellation without changing any wish behavior.

## Change request CR-037 — The Wish Sky Becomes a Constellation

**Objective:** strengthen the visual relationship between released wish stars while leaving selection, wish text, and all user-facing actions unchanged.

### REQ-024 — Decorative constellation trace

When two or more wishes are released into the sky, Wish sky must draw a faint connected line through their existing star positions.

**Acceptance criteria**
1. Zero wishes renders no constellation trace; the existing empty-sky hint remains unchanged.
2. One wish renders its single star without a trace; a trace appears only at two or more wishes.
3. Exactly one decorative SVG polyline follows the released wishes' existing ordered positions. It uses the existing local state and introduces no new layout state.
4. The trace is visually restrained and sits behind the star buttons; it uses `pointer-events:none` so star selection and wish text remain unaffected.
5. The SVG is `aria-hidden="true"` and `focusable="false"`. The labelled star buttons stay in the accessibility tree with their current selection behavior.
6. The sky and all star buttons fit the existing laptop and 375px phone layouts without horizontal overflow.
7. The trace does not add a new animation; it stays still under every motion preference.
8. No new route, package, external asset, service, backend, browser storage, or paid feature is introduced.

**Risk:** R1 (decorative SVG layer placed over an existing interactive field).  
**Validation:** Playwright confirms no trace at zero/one wishes, exactly one trace with coordinates for three released wishes, correct accessibility attributes, a working star selection, and viewport bounds at 1366px and 375px. Node/content tests, production build, and the complete Chromium suite are required on the exact final PR head before merge.

## Evidence standard

Only exact PR-head CI supports promotion to main. Automated layout checks do not certify physical-device, human screen-reader, or production-alias behavior.
