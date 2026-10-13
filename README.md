# For Malika, With All My Heart 💜

A romantic, interactive birthday experience made by Zack for Malika, whose birthday is **12 October**. Built with React, Vite, and Motion: a connected moonlit universe of a lavender garden, Mimi the kitten, red ladybugs, purple hearts, hidden wishes, and a heart-collection game, now styled in a refined deep-violet, pearl, lavender, and soft-rose palette.

## Run locally

Requirement: Node.js 20.19 or newer.

    npm install
    npm run dev

Open the local URL printed by Vite.

## Automated validation

Run the reducer/content checks and production build:

    npm test
    npm run build

For browser tests:

    npx playwright install chromium
    npm run test:e2e

GitHub Actions installs Chromium's operating-system dependencies, runs the suite against the production build, and retains the Playwright HTML report and rendered screenshots. The merged Loop 007 checkpoint passed **8 Node tests, the Vite production build, and 20 Chromium browser journeys** in [CI run 38247015295](https://github.com/teyyara/malika/actions/runs/38247015295). Journeys include navigation, wrong-move recovery, reset/retry, arcade mastery, keyboard secrets, and a narrow 320px viewport. Loop 008 passed all 21 Chromium browser journeys, 8 Node tests, and the Vite production build; see CI run 38248660014.

## The experience

- **Personal welcome:** an opening written for Malika from Zack.
- **Interactive garden:** pet Mimi (she gets cheekier on repeat visits), follow fluttering ladybugs, touch a flower for a wish, trace three stars for a heart-shaped constellation, and optionally open the gentle clue guide (with no spoiler map). Jumping ahead earns a teasing nudge, not silent failure.
- **Mimi's Little Heart Garden:** collect seven purple hearts; each collectible scores only once, with an animated victory and secret-letter unlock.
- **Love collection:** 30 affectionate notes plus five future-facing little dreams; secret letters unlock at victory.
- **Birthday finale:** a personal letter revealed in a measured sequence and an optional final surprise.

## Personalization

Names, date, welcome copy, game target, and the birthday letter are centralized in `src/data/siteConfig.js`. Edit notes in `src/data/loveMessages.js`. The five entries in `src/data/memories.js` are explicitly imagined future moments, not claims that an event already happened.

The experience has no backend, analytics, paid API, or remote image service. Cat and ladybug artwork is inline SVG. Sound is on by default. Modern browsers may block audible autoplay until the first user gesture, so the welcome CTA unlocks the Web Audio context and plays a small opening cue on that first tap. The sound switch is available to hush the experience at any time. Mimi's meows and purr are real cat recordings bundled locally in public/audio/ (attribution and source links are in docs/audio-credits.md), with a matching moving mouth and purr animation. Petting during an unfinished decode never piles up delayed voices, and the purr gets a longer, softly faded 3.2-second moment. The romantic love-note score and achievement fanfares are original Web Audio arrangements with warm harmonic layers, subtle stereo movement, and a gentle echo; every arcade quest, the seven-heart game, and the grand secret have a distinct reward cue. Prize medallions replay their own fanfare. No external audio CDN, remote runtime sound service, new package, or paid feature is required. Mimi dances after three quick pets, love notes can receive a returned heart, and discovery/game events can chime. Muting sound stops active playback; keyboard focus patterns and reduced-motion support are included. The compact **Mixer** beside the sound toggle provides an overall volume slider, independent faders for Mimi's recorded voice, love-note music, and game/effect sounds, plus buttons to audition Mimi's meow and purr. Levels are page-memory only and reset on reload. Mimi's mouth, tiny head tilt, and soft halo also react to the measured envelope of her real meow/purr recording, then settle when the clip ends; the meter stops on mute or tab hide and respects reduced-motion preferences.

## Scene soundtracks, the Secret Arcade lock, and the visual palette

Each main scene now has its own locally synthesized looping score: the garden, Heart Game, Love Notes collection, and birthday letter. Opening an individual love note switches to a separate romantic theme; closing it returns to the current scene's score. All five Secret Arcade games also have their own musical arrangement while they are played, then yield back to the scene's score on return. The music uses the existing Web Audio system, faders, master volume, and mute control—no audio CDN, downloaded soundtrack, backend, new package, or paid service is required. A user gesture is still needed to unlock audible playback in the browser.

The Secret Arcade now asks for a password before showing the five games. Enter `iloveyou`; a wrong answer keeps the door closed. The unlock lasts for the current page visit only and resets on refresh. Hidden entrances, including the `MIMI` keyboard shortcut, cannot bypass the gate.

The visual system balances deep violet and amethyst with pearl-white highlights, subtle rose, and cool-blue undertones. The previous heavy champagne/gold emphasis has been replaced with calmer glass-like panels, cleaner contrast, and precise lavender details.

## Laptop viewing

Loop 026 adds a dedicated desktop composition layer for common laptop viewports (1280×800, 1366×768, and 1440×900). It trims excess vertical gaps, sizes Mimi and the welcome copy as a balanced two-column cover, gives the garden its own clear visual lead, keeps all three garden destinations aligned, and reduces the heart arena height so it feels intentional rather than oversized. The love-note grid, letter art/paper ratio, and hidden dialogs receive matching spacing refinements. A separate short-screen breakpoint accounts for laptops around 720–760px tall.

The changes are isolated to `src/styles/laptop-layout.css` at desktop widths of 1024–1600px; existing tablet and mobile rules are left in place. Automated Chromium checks cover all three laptop viewport sizes across the welcome, garden, heart game, love collection, and birthday letter, plus the Secret Arcade and Firefly Hunt dialog fit at 1366×768.

## A living sky, Mimi's tiny life, and the little universe studio

Loop 027 makes the garden a more personal, evolving place through a four-part **companion studio**:

- **Mimi's Tiny Daily Life + Love Language:** Mimi rotates through small routines while the garden is open—keeping watch over the stars, taking a nap, spotting butterflies, or saving a purr for Malika. Petting her, playing with a ribbon, inviting a cozy nap, or telling her something sweet triggers a distinct reaction and locally bundled cat sound.
- **A Sky That Changes With Your Journey:** the shared background progresses from twilight to moonrise, a dreamier sky, a bright constellation field, and finally a full-universe finale. The changes respond to notes discovered, hearts collected, and wishes released; the wish stars also remain visible in the shared sky as you move between scenes.
- **A Little Wish Sky:** Malika can choose one of six handcrafted wishes from Zack or write a wish of her own (up to 160 characters). Releasing it animates a glowing star with a tiny trail, adds it to the sky and the wishes collection, and changes the world's progress state.
- **Our Soundtrack Player:** choose from five original moods: the garden, rain against the window, a sky full of stars, a cozy evening, or the birthday song. The new arrangements are composed locally through the existing Web Audio engine. Scene scores resume when the player is paused or the garden is left, while love-note and arcade overrides retain their priority.
- **The Picture That Comes Alive:** tap a locally illustrated keepsake frame to animate Mimi, the night sky, floating light, and a tiny ladybug. No external image is loaded.
- **The Grand Finale — A Universe Made for Her:** opening the last surprise changes the app-wide sky, adds a cinematic reveal, and acknowledges the wishes she released.

The companion studio is grouped into four tabs so the garden doesn't become a wall of unrelated widgets. Wish history, chosen music, and the finale state use in-memory React state only. They reset with a fresh page visit; no account, backend, analytics, browser storage, remote asset service, paid API, or new dependency is added. Audio still respects the existing sound switch, browser audio policy, mixer, and reduced-motion preferences.

New automated coverage lives in `e2e/journey-features.spec.js`: Mimi's responses, prepared/custom wishes and sky state, soundtrack selection and restoration, the living-picture toggle, the universe finale, and horizontal-fit checks at phone and laptop sizes.

## Vercel deployment

The Vercel project **malika-birthday** is connected to this repository. The last previously confirmed production deployment is recorded at the [Vercel dashboard](https://vercel.com/tyyr1/malika-birthday/CzGS17bNAaTbaUCH7uLAP7XR6rQv). The Loop 007 production attempt reported failed ([deployment details](https://vercel.com/tyyr1/malika-birthday/GrbCE3RnoKGws4A54c3NvJyoV7TE)). Loop 008's PR preview passed, but the latest main commit has not reported a Vercel status through GitHub and the connected Vercel integration cannot access deployment logs. The latest production release is therefore unverified; treat it as live only after Vercel reports Ready. No access-bypass token is stored in this repository.

Framework: **Vite**, build command `npm run build`, output directory `dist`, root directory `./`, no environment variables.

## Hidden Easter eggs and mini-games

The extra secrets are optional; all core birthday scenes stay available without finding any of them. The arcade now includes a heart-trail route with decoys, a shuffled four-pair memory board that does not leak pair identities through accessible labels, a replayable six-beat rhythm code, five decoy-aware fireflies, and a tiny riddle-lock for the wish jar. The garden includes a collapsed hint guide with a gentle clue and a clearer nudge; the spoiler map was removed to preserve the surprise. See [docs/loop-008-gentle-secret-hints.md](docs/loop-008-gentle-secret-hints.md) and the walkthrough in [docs/easter-egg-test-guide.md](docs/easter-egg-test-guide.md). Every mini-game now ends with its own full-screen, animated victory celebration. After all five games, the fifth celebration also offers the animated **Keeper of Little Wonders** finale; see [docs/loop-006-grand-secret.md](docs/loop-006-grand-secret.md). Browser regression coverage lives in `e2e/easter-eggs.spec.js` and `e2e/birthday.spec.js`.

## Project status and evidence

See `AEOS_STATUS.md`, `.aeos/state.json`, `docs/product-contract-v1.1.md`, and `evidence/loop-004-release.md`, `evidence/loop-005-easter-eggs.md`, and `docs/easter-egg-test-guide.md`. Automated tests pass; screen-reader validation and physical-device touch QA remain separate, unobserved gates.


## Loop 028 — The Flower That Grows With Love

The pink flower in the garden now opens a little more as Malika discovers notes, collects hearts, and releases wishes. Five gentle growth stages are derived from the current visit's progress; nothing is stored in the browser or sent anywhere. At full bloom, the flower reveals a tiny note from Zack in Mimi's live reply. The flower stays keyboard-operable, its current bloom stage is available through an accessible description and tooltip, and its petal transitions are removed when reduced motion is requested.
