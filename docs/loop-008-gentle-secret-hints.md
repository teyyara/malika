# Loop 008 — Gentle secret clues

Date: 12 October 2026

## Intent

The birthday experience should reward curiosity without making Malika hunt blindly or revealing the whole surprise by accident. A new optional clue trail sits beneath the garden scene.

## Experience

- The guide starts collapsed; it adds no overlay and does not interrupt the primary birthday journey.
- “Need a tiny nudge?” reveals a gentle, non-specific clue.
- “Give me a clearer clue” reveals the key numbers and the areas worth exploring.
- The spoiler-map disclosure was subsequently removed in Loop 009 to preserve the birthday surprise; the guide now stops at the clearer clue.
- The guide uses a native disclosure and one nested clue control, operable by mouse, touch, Enter/Space and keyboard; visible focus outlines are provided.
- The guide deliberately does not list secret entrances or arcade solutions, so it offers help without revealing the surprise.
- Mobile layout is tuned for 320px and honors the reduced-motion preference.

## QA added

A new Playwright journey checks that:
- The clue panel is present on the garden and initially collapsed.
- Keyboard activation opens the first disclosure.
- A clearer clue is available, but no spoiler-map text or spoiler disclosure exists.
- The guide and garden do not overflow horizontally at a 320px-wide viewport.

The tests run against the production Vite build in Chromium alongside all Loop 007 regression journeys. This is browser automation, not physical-device or screen-reader certification.

## Privacy and scope

The guide is entirely static and client-side. It adds no backend, analytics, external API, storage, dependency, or tracking. No hidden progress is made mandatory; all birthday scenes and the main heart game remain available without opening the guide.


## Loop 009 follow-up — spoiler map removed

The visible garden guide intentionally ends after the clearer nudge. The full map remains out of the visitor-facing garden experience, while detailed walkthroughs stay in developer-facing QA documentation.
