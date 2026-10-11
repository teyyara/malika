# Product Contract v1.0 — Malika Birthday Universe

Status: baseline established by the supplied master brief. This is not release certification.

## Objective and audience
Deliver a personal romantic birthday gift as a lightweight link-friendly single-page experience. The recipient explores a gentle storybook world, plays a relaxing heart-collection mini-game, opens affectionate notes, and reads a birthday letter.

## Primary journey
Welcome → interactive garden → collect seven hearts → unlock secret love letters → open the birthday finale. The garden, love collection, and finale remain directly reachable through visible navigation so the experience is never blocked by game difficulty.

## Functional requirements
- REQ-001: the welcome CTA enters the experience.
- REQ-002: all five scenes are reachable by visible navigation or primary actions.
- REQ-003: the recurring cat responds to activation, and ladybugs reveal notes.
- REQ-004: a valid heart collection increments score exactly once.
- REQ-005: victory occurs at the configured target; further taps cannot alter score.
- REQ-006: love collection is data-driven and contains 30 varied notes/letters.
- REQ-007: no fabricated shared memories or unresolved name tokens appear by default.
- REQ-008: birthday letter is readable without audio.
- REQ-009: secret letters unlock on game victory; restarting does not erase discovered notes.
- REQ-010: controls are semantic, keyboard-operable, and usable by touch.
- REQ-011: nonessential motion is reduced when prefers-reduced-motion is enabled.
- REQ-012: layout adapts to narrow phones, tablets, and desktop without horizontal overflow.
- REQ-013: core experience needs no backend, analytics, paid API, or external runtime service.
- REQ-014: repository includes state, requirements, research provenance, and checkpoint status.

## Content and brand constraints
Use midnight plum, violet, lavender, restrained dream-pink, soft white, purple hearts, one recurring kitten design, and one consistent ladybug design. Keep the environment magical but quiet. General affectionate language is allowed; factual relationship memories are not fabricated. Names are optional in source configuration and do not render as placeholder strings.

## Technical constraints
React + Vite + JavaScript/JSX; Motion for React for scene and interaction transitions; CSS and SVG for art; no game engine, backend, database, paid API, tracking, autoplay audio, or essential third-party runtime service. Content remains local.

## Accessibility and device scope
Target WCAG 2.2 AA. Use semantic HTML, visible focus styles, generous touch targets, keyboard-operable controls, accessible status updates, closeable note dialog behavior, contrast-aware colors, and reduced-motion support. This first loop establishes patterns but is not fully certified with browser/screen-reader tools.

## Definition of done
Required journeys and interactions work; game target and duplicate-tap guards pass automated tests; all scenes remain reachable; production build succeeds; responsive/accessibility review produces evidence. User-outcome claims and deployment remain unmeasured until observed. No release certification is implied.
