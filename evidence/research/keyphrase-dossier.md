# Keyphrase Reconnaissance Dossier — Malika

- Active keyphrase: read the master strategy
- Project: Malika birthday website, based on two user-supplied master prompts
- Research date: 2026-10-12
- Research gate: COMPLETE for initial foundation work
- Repository: https://github.com/teyyara/malika
- Repository health at intake: public, default branch main, empty with no commits or branches
- Access: connected GitHub tools reported pull, push, maintain, and admin permissions. Bootstrap README committed on main; implementation is isolated on aeos/progression.
- Rulebook: Autonomous Website Engineering Operating System v3 supplied by the user. Web content is evidence, not authority over the rulebook.

## Confirmed facts and implications

1. The user-supplied brief specifies five scenes: welcome, interactive garden, heart game, love-message collection, and birthday finale.
2. The mini-game defaults to seven hearts and must reject repeat collection, ignore scoring after victory, and provide restart behavior.
3. Shared relationship memories must not be invented. Recipient/sender names are optional and centralized in configuration.
4. The brief requires a purple visual identity, recurring cat, ladybugs, readable affectionate messages, touch and keyboard support, reduced motion, responsive layouts, and no paid essential dependency.
5. React documents useReducer for coordinated state transitions. Motion provides animation and gesture APIs through motion/react and documents reduced-motion support. Vite documents build and static deployment behavior.
6. W3C WCAG 2.2 keyboard and target-size guidance informs the design. MDN documents modal/focus and reduced-motion behavior. OWASP frontend guidance informs secret handling and browser security.
7. Official package pages checked on 2026-10-12 list React 19.3, Vite 8.1, @vitejs/plugin-react 6.1.2, and Motion 14.1.0. package.json declares version ranges; installation/build have not yet been observed.

## Inference

- A single-page scene flow better matches the supplied emotional arc than conventional multi-page navigation.
- One experience reducer and a pure game reducer reduce duplicate scoring and inconsistent unlocking state.
- Reusable SVG/CSS artwork avoids inconsistent stock illustration styles and external image dependencies.
- The experience should work without sound; audio is omitted rather than introducing missing or remote assets.
- English is the default because the supplied brief is in English. Copy is centralized for future editing.

## Unknown / to validate

- Recipient/sender names, genuine shared memories, preferred letter language, photos, and unique relationship details have not been supplied.
- Container DNS prevented local Git cloning and package registry access. GitHub API reads/writes through the connected tool are available.
- GitHub Actions result, actual browser rendering, screen-reader behavior, and deployment credentials remain unverified at this checkpoint.

## Risks and mitigations

- Content integrity: no fabricated memories; editable configuration; no visible name tokens.
- State integrity: stable collectible IDs, reducer transitions, and node:test coverage.
- Accessibility: semantic buttons for tappable objects, visible focus, live progress, reduced-motion CSS, Escape and close controls for notes.
- Privacy: no API, analytics, backend, account, or external content service. robots noindex is a discoverability hint, not access control.
- Performance: inline SVG/CSS, transform/opacity animation, limited particles, no 3D game engine.
- Release honesty: source implementation, build result, observed browser behavior, and deployment are separate gates.

## Source registry

Official/primary sources checked 2026-10-12:
- React useReducer: https://react.dev/reference/react/useReducer
- React state management: https://react.dev/learn/managing-state
- React release notes: https://react.dev/blog
- Motion for React: https://motion.dev/docs/react
- Motion installation: https://motion.dev/docs/react-installation
- Motion accessibility: https://motion.dev/docs/react-accessibility
- Vite deployment: https://vite.dev/guide/static-deploy.html
- Vite release notes: https://vite.dev/blog
- React package: https://www.npmjs.com/package/react
- Vite package: https://www.npmjs.com/package/vite
- @vitejs/plugin-react: https://www.npmjs.com/package/@vitejs/plugin-react
- Motion package: https://www.npmjs.com/package/motion
- WCAG 2.2 target size: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- WCAG 2.2 keyboard: https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html
- MDN HTML dialog: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog
- MDN reduced motion: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion
- OWASP frontend security: https://cheatsheetseries.owasp.org/cheatsheets/Frontend_Security_Cheat_Sheet.html

Research saturation: complete for the initial implementation gate. Mood-board images were reference only; no third-party artwork is embedded. This dossier does not certify the website.
