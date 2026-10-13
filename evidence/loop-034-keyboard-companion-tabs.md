# Loop 034 — Keyboard-Ready Companion Tabs

## Scope

The five tabs inside Mimi's garden companion studio become fully keyboard-operable using the familiar tablist interaction pattern, without changing their order, labels, content, visual appearance, or top-level navigation.

## Implementation

- The selected tab is the only tab stop in the ordinary Tab order; remaining tabs use `tabIndex=-1`.
- Left/Right Arrow moves focus and activation together, wrapping in both directions.
- Home/End focuses and selects the first/last tab.
- Existing tab/panel IDs and ARIA relationships remain unchanged. The panel is immediately switched to the active tab, and focus stays on the newly active tab.
- All state is in React memory; no backend, storage, remote asset, new dependency, or manual deployment is added.

## Validation plan

- Playwright will test tab-stop count, focus and selection synchronization, panel visibility, Home/End, wraparound in both directions, and the five-tab count.
- The complete repository workflow must pass Node/content tests, production build, and all Chromium journeys on the exact PR head before merge.
- Automated browser keyboard events do not certify human screen-reader or physical-device usability. No Vercel deployment is initiated.
