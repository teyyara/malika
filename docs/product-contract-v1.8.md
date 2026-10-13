# Product Contract v1.8 — Malika Birthday Universe

Status: Loop 034 is implemented on a feature branch on 13 October 2026. Product Contract v1.7 remains the prior baseline; this change completes keyboard operation of the existing companion tablist.

## Change request CR-034 — Keyboard-Ready Companion Tabs

**Objective:** let keyboard users move between the five companion panels without having to Tab through every tab button.

### REQ-021 — Keyboard navigation for companion tabs

**Acceptance criteria**

1. The existing five companion tabs remain in the same panel, with the same labels, IDs, order, styles, and contents.
2. The tablist identifies itself as horizontal. Exactly one tab has `tabIndex=0` and all other tabs have `tabIndex=-1`.
3. Right Arrow moves focus and selected content to the next tab, wrapping from the last tab to the first.
4. Left Arrow moves focus and selected content to the previous tab, wrapping from the first tab to the last.
5. Home selects and focuses the first tab; End selects and focuses the last tab.
6. The active tab's `aria-selected`, tab stop, focus, panel ID/label relationship, and visible panel remain synchronized.
7. Pointer activation continues to work as before. Existing visible focus styling, reduced-motion support, responsive layout, and visit-only state are preserved.
8. No new package, storage, backend, analytics, paid API, remote asset, or third-party service is introduced.

**Risk:** R1 (keyboard behavior change in the existing companion studio).  
**Validation:** Playwright checks five tabs, roving tab stop, arrow navigation, wraparound, Home/End, selected-panel behavior, and one focus/tab stop at a time. Exact PR-head CI is the merge gate.

## Evidence standard

Only exact PR-head CI supports promotion to main. Automated keyboard events do not certify human screen-reader or physical-device behavior.
