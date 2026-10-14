# Product Contract v2.2 — Malika Birthday Universe

Status: Loop 038 candidate — validation pending. Product Contract v2.1 remains the preceding accepted baseline until this change is validated and merged.

## Change request CR-038 — Mimi reacts like her words

**Objective:** make Mimi's visible expression and movement agree with the mood and response described by the experience, and give her an observable role during each Secret Arcade game.

### REQ-025 — Mood-consistent kitten reactions and game feedback

**Acceptance criteria**

1. The CatCharacter's initial expression reflects its supplied mood: curious, happy/delighted, surprised, sleepy, or love.
2. Its motion follows the scene mood: happy has an energetic gentle bob, love is warm and settled, sleepy is slow and drowsy, and curious is lightly inquisitive. A deliberate pet may temporarily create a stronger reaction without leaving stale expression state behind after the mood changes.
3. The “Mimi's little life” actions visually match their copy. Ribbon play uses a delighted/zoomie reaction, a cozy nap uses the sleepy expression, and cuddles or a whispered secret use the love/slow-blink expression.
4. Each of the five Secret Arcade minigames displays a visible Mimi companion. Correct actions make her visibly delighted; wrong guesses make her surprised and pair the expression with the existing textual nudge; the game reset restores curiosity; a completed game shows her celebratory mood.
5. Existing game mechanics remain unchanged: the ordered eight-star trail, four memory pairs, six-beat rhythm, five real fireflies, and five wish riddles retain their current rules and retry behavior.
6. Keyboard-operable game controls, existing live feedback, the 320px arcade viewport, and reduced-motion support remain intact. Mimi is decorative within the game companion, not an extra focus stop.
7. No new package, paid feature, backend, browser storage, remote asset, analytics, or external service is introduced.

**Risk:** R1 component/game feedback behavior.

**Validation:** exact-PR-head Node/content tests, production build, and Playwright Chromium suite. New regression journeys assert actual kitten reaction classes for each daily-life mood and all five minigames. Passing automation does not certify human speaker-quality, screen-reader, physical-device, or production-alias behavior.
