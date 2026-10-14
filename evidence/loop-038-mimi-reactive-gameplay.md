# Loop 038 — Mimi's reactions match the words

Date: 14 October 2026  
Repository: https://github.com/teyyara/malika  
Candidate branch: `fix/loop-038-mimi-reactive-gameplay`  
Requirement: REQ-025 / Product Contract v2.2  
Risk: R1

## Problem

The daily-life panel changed its message and surrounding scene mood, but the kitten's CSS reaction class and movement were mostly driven by a separate local click cycle. The Secret Arcade descriptions repeatedly said Mimi would notice errors, tease the player, or celebrate successful moves, but the minigames did not display Mimi beside their controls.

## Intervention

- Bind the kitten's default expression and idle motion to its supplied mood, while preserving short pet reactions and respecting reduced-motion settings.
- Add one visible, non-focusable Mimi companion to each arcade minigame.
- Reflect existing game outcomes in Mimi's mood: mistakes become surprised reactions, correct moves become delighted reactions, the wish jar responds warmly, and game starts reset her to curious.
- Add Playwright coverage for daily-life mood consistency and mistake/correct-move feedback in all five arcade games.
- Preserve the five games' existing scoring, reset, hint, win and retry rules. No new dependency, remote resource, paid feature, or storage is added.

## Validation record

- Baseline main checkpoint: `6353eff85240f23a7338b38c0769a6fd55ffd527`.
- Candidate validation: PENDING; record exact PR-head and post-merge CI runs before marking this loop validated.
- No Vercel deployment is initiated by this work. The owner handles deployment and production verification.
- Remaining human QA limits: screen-reader behavior, physical mobile devices, and listening to audio on real speakers are not certified by browser automation.
