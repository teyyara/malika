# Loop 008 — Gentle secret clues

Date: 12 October 2026

## Intent

The birthday experience should reward curiosity without making Malika hunt blindly or revealing the whole surprise by accident. A new optional clue trail sits beneath the garden scene.

## Experience

- The guide starts collapsed; it adds no overlay and does not interrupt the primary birthday journey.
- “Need a tiny nudge?” reveals a gentle, non-specific clue.
- “Give me a clearer clue” reveals the key numbers and the areas worth exploring.
- “Show me the full secret map (spoilers inside)” explicitly opts into step-by-step hints for every hidden entrance and the five-game arcade.
- Native nested disclosure controls work by mouse, touch, Enter/Space and keyboard focus; visible focus outlines are provided.
- The guide includes the phone-friendly alternatives and each arcade objective, plus the 5/5 grand reveal.
- Mobile layout is tuned for 320px and honors the reduced-motion preference.

## QA added

A new Playwright journey checks that:
- The clue panel is present on the garden and initially collapsed.
- Keyboard activation opens the first disclosure.
- The spoilers remain hidden until the visitor explicitly opens the spoiler section.
- The progressive clue and spoiler map contain the expected entrances and game objectives.
- The guide and garden do not overflow horizontally at a 320px-wide viewport.

The tests run against the production Vite build in Chromium alongside all Loop 007 regression journeys. This is browser automation, not physical-device or screen-reader certification.

## Privacy and scope

The guide is entirely static and client-side. It adds no backend, analytics, external API, storage, dependency, or tracking. No hidden progress is made mandatory; all birthday scenes and the main heart game remain available without opening the guide.
