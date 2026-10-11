# Product Contract v1.1 — For Malika, With All My Heart

Status: personalized baseline on 2026-10-12; automated validation pending for this revision.

## Objective and audience

Deliver a personal romantic birthday gift made by Zack for Malika. Her birthday is 12 October. The recipient explores a moonlit storybook world, plays a relaxing heart-collection mini-game, opens affectionate notes, and reads a birthday letter.

## Primary journey

Personal welcome → interactive garden → collect seven hearts → unlock secret love letters → open the birthday finale. The garden, love collection, and finale remain directly reachable through visible navigation so the experience is never blocked by game difficulty.

## Functional requirements

- REQ-001: the welcome CTA enters the experience.
- REQ-002: all five scenes are reachable by visible navigation or primary actions.
- REQ-003: the recurring cat responds to activation and ladybugs reveal the associated note.
- REQ-004: a valid heart collection increments score exactly once.
- REQ-005: victory occurs at the configured target; further taps cannot alter score.
- REQ-006: the collection has 30 notes plus five future-facing dream cards; five secret letters unlock on victory.
- REQ-007: Malika and Zack are filled in as the recipient/sender; no visible name placeholders or fabricated historical memories.
- REQ-008: the birthday letter names Malika and is signed by Zack; it is readable without audio.
- REQ-009: secret letters unlock on game victory; restarting does not erase discovered notes.
- REQ-010: controls are semantic, keyboard-operable, and usable by touch.
- REQ-011: nonessential motion respects prefers-reduced-motion.
- REQ-012: layout adapts to narrow phones, tablets, and desktop.
- REQ-013: core experience requires no backend, analytics, paid API, or external runtime service.
- REQ-014: repository contains state, requirements, research provenance, and checkpoint status.

## Content and brand constraints

Use midnight plum, violet, lavender, restrained dream-pink, soft white, purple hearts, one recurring kitten design, and a consistent red ladybug design. The welcome identifies Malika, the creator/sender is Zack, and the date label is 12 October. General affectionate language and optimistic future plans are allowed. Do not claim unprovided shared events happened in the past.

## Personal content rule

No past relationship memories were supplied. To avoid an empty section while respecting truthfulness, the former memory shelf now contains five explicitly future-facing dreams, such as a slow morning, a tiny adventure, and a cat-approved evening. They are wishes, not purported recollections.

## Technical constraints

React + Vite + JavaScript/JSX; Motion for React for scene and interaction transitions; CSS and SVG for art; no game engine, backend, database, paid API, tracking, autoplay audio, or essential third-party runtime service.

## Accessibility and device scope

Target WCAG 2.2 AA. Use semantic HTML, visible focus, keyboard-operable controls, accessible status updates, close/Escape dialog behavior, contrast-aware colors, and reduced-motion support. Automated build/tests do not certify browser or screen-reader accessibility.

## Definition of done

Journeys and interactions work, duplicate collection guards pass tests, all scenes remain reachable, production build succeeds, responsive/accessibility review produces evidence, and deployment is verified if available. This contract does not claim that browser QA or deployment has occurred.
