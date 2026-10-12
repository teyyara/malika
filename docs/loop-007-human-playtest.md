# Loop 007 — Human-play QA and interaction repairs

Date: 12 October 2026

## Why this pass exists

The previous browser suite proved that the easy/winning paths could complete, but it left several real-player interactions under-tested. This pass adds negative-input, retry, reset, timer, and narrow-viewport journeys.

## Defects corrected

1. **Ladybug toast could get stuck.** The Easter Egg component re-ran its dialog effect whenever a panel changed, and its cleanup cleared the toast timeout. Clicking “Open Secret Arcade” after the fourth ladybug could leave the discovery toast visible indefinitely. Timeout cleanup is now tied to component unmount; opening or closing a dialog no longer cancels the timer.
2. **Footer-star secret was not operable by keyboard or assistive technology.** It was an aria-hidden span observed by a document click listener. It is now an explicitly labelled button with visible hover/focus styling, while retaining the three-click secret.
3. **Memory Match gave little feedback for a mistake.** A wrong pair could remain exposed without a clear status message. The pair now receives a distinct visual state, an announced/live hint, and flips face-down after a brief feedback pause. Selecting a third card during that pause cancels the timer and continues play. This is a feedback delay, not a game countdown.

## Automated human-play journeys

The browser suite now exercises:

- All five Secret Arcade games and the 5/5 Keeper of Little Wonders reveal.
- An incorrect Memory Match pair, the automatic flip-back, selecting another card during the pause, and then completing the game.
- A wrong Pawprint Rhythm entry followed by a correct retry.
- The original ladybug discovery toast still dismisses itself after opening the arcade.
- Opening and closing the arcade at a 320px-wide phone viewport, with an overflow assertion.
- Restarting the main seven-heart game halfway through and completing a fresh run.
- Existing keyboard entrances (Konami, MALIKA, MIMI), the moon, Mimi petting, footer star and ladybug trail.
- Navigation through welcome, garden, heart game, love-note collection and birthday finale; prior mobile overflow and reduced-motion checks remain in place.

## Release verification

The merge is gated on the GitHub Actions workflow Validate Malika: Node game/content tests, the Vite production build, and Playwright Chromium against the production build. The resulting run link and exact test counts are recorded after the workflow completes.

## Not claimed as automated

A real physical phone, Safari/WebKit, VoiceOver/NVDA, and mobile screen-reader/touch exploration still require manual verification. The narrow viewport checks run in headless Chromium; they are not a substitute for device testing.
