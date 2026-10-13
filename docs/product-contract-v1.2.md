# Product Contract v1.2 — Malika Birthday Universe

Status: Loop 028 change request accepted for implementation on 13 October 2026. The existing v1.1 product contract remains the baseline; this version adds the Love Blossom behavior only.

## Change request CR-028 — The Flower That Grows With Love

**Objective:** make garden exploration feel cumulative and tender by letting the existing flower visually open as Malika interacts with the rest of the experience.

### REQ-015 — Exploration-driven love blossom

The existing garden flower must progressively blossom from current-visit discoveries and reveal a small authored note when fully open.

**Acceptance criteria**
1. The flower starts at stage 0 on a fresh visit.
2. Its visual progress is derived from discovered love notes, collected hearts, and released wishes. Wishes contribute a little extra to reflect the observatory activity.
3. It has five ordered bloom stages and reaches stage 5 after enough activity; each state has an accessible name that includes progress or the fully bloomed state.
4. Clicking before full bloom gives a helpful hint through the existing live cat-reply region. Clicking after full bloom reveals a short, clearly authored note and uses the existing local sound-effect path.
5. The action works with a keyboard as well as pointer/touch. Petal transitions respect prefers-reduced-motion.
6. Progress is React in-memory state for this visit only. No browser storage, backend, analytics, paid API, new dependency, or remote asset is permitted.
7. Existing navigation, notes, mini-games, soundtrack priorities, and established laptop/mobile layout remain intact.

**Risk:** R1 (component behavior in an existing scene).  
**Validation:** Playwright journey covering closed → partial → full bloom, live-message behavior, and an existing laptop/mobile overflow matrix; production build and existing unit/browser suite remain required.

## Evidence standard

A successful build alone does not prove the interaction works. Record the exact PR head and CI result before marking this requirement as validated. Real-device touch and screen-reader checks remain unobserved unless separately performed.
