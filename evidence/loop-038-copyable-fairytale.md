# Loop 038 — Take This Little Story With You

## Scope

The ending of Mimi's Tiny Storybook gains an explicit **Copy this tiny fairytale** action. The plain-text version is composed from the current choice path, the selected third-chapter ending, the existing sign-off, and the current sky wish when present.

## Privacy and fallback

- Copying is user-triggered and uses the browser clipboard only; the site does not send or save the text.
- Success feedback appears only after the clipboard write resolves.
- If clipboard access is unavailable or rejected, an accessible status and labelled read-only text area expose the complete story for manual copying.
- Changing the selected sky wish clears outdated copy/fallback UI. Replaying resets it too.
- No new package, service, remote asset, or storage mechanism is added.

## Validation plan

- Node test verifies all selected passages and the final ending are included, the optional wish is included only when selected, and incomplete paths return no share text.
- Browser tests check the real output, clipboard success feedback, a deliberately rejected write, text selection in the fallback, reset after replay, and 375px viewport bounds.
- Exact PR-head CI and post-merge main CI are required. No manual Vercel deployment is initiated. Production alias, human screen-reader behavior, and physical-device QA remain owner-unverified.
