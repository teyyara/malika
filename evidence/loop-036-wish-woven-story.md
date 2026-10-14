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

## Validation results

- **Exact final PR-head:** [workflow 38640128647](https://github.com/teyyara/malika/actions/runs/38640128647) passed on `6c52a9e084ad4b19c721345b6734c7f4c2653491`.
- **Post-merge main:** [workflow 38640794831](https://github.com/teyyara/malika/actions/runs/38640794831) passed on merge commit `98ceb9d184566b2498b0fc605eb0ea809c97e3b5`.
- Both passed Node/content tests, the production build and all **59 Chromium browser journeys**.
- New coverage releases two wishes, confirms the latest default, changes the selection, verifies that the text rendered inside the story follows the selection, checks the no-overflow bounds at 375px, and confirms replay returns to the latest wish.
- The original storybook journey still completes an ending with no wishes released and confirms the optional UI is absent.
- No manual Vercel deployment is initiated. Production-alias, human screen-reader and physical-device status remain unverified.
