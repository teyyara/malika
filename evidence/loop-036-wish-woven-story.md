# Loop 036 — A Wish Woven Into the Story

## Scope and intent

A wish already released into Wish sky during the current visit can be woven into the ending of Mimi's tiny fairytale. This links two existing experiences while keeping the story optional and avoiding new destinations, storage, or services.

## Behavior

- The existing `releasedWishes` array is passed down from `GardenCompanionStudio` into `MimisStorybook`.
- The ending offers at most the five most recent wishes.
- The latest wish is selected by default; the selected wish appears inside the story card, and choosing another updates the in-story text in place.
- Replaying the story resets the selection to the latest wish.
- With no released wishes, the hint, chooser, and wish inlay remain absent.
- Uses native buttons with explicit accessible names and `aria-pressed`, responsive layout, and existing sound cues.
- No state is duplicated to storage. No new package, remote asset, backend, analytics, paid feature, or external service.

## Validation plan

- Exact final PR-head CI must pass Node/content tests, production build, and the full Chromium browser suite.
- Browser coverage releases two wishes, checks default and changed selection, confirms the in-story card matches the selected wish, checks replay reset, and measures 375px viewport bounds.
- No manual Vercel deployment is initiated; production alias, human screen-reader and physical-device behavior remain owner/human QA gates.
