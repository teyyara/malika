# Loop 004 release evidence — 12 October 2026

## Source and validation

- Repository: https://github.com/teyyara/malika
- Validated application checkpoint promoted to `main`: `8fe4b6363a748f7987d17b8f9ede8e7682d4a9e8`
- CI workflow: https://github.com/teyyara/malika/actions/runs/38188085348
- Node tests: 8 passed, 0 failed
- Vite production build: passed
- Chromium browser tests: 7 passed, 0 failed
- Browser report artifact: https://github.com/teyyara/malika/actions/runs/38188085348/artifacts/11720472630
- Six rendered screenshot artifact: https://github.com/teyyara/malika/actions/runs/38188085348/artifacts/11720173606
- Pull request #2: https://github.com/teyyara/malika/pull/2

## Vercel

- Project: https://vercel.com/tyyr1/malika-birthday
- Vercel-reported production deployment: Ready, from `main` at the validated application checkpoint
- Production aliases returned by Vercel:
  - `malika-birthday-kappa.vercel.app`
  - `malika-birthday-tyyr1.vercel.app`
  - `malika-birthday-git-main-tyyr1.vercel.app`
- Vercel-reported Ready branch preview: https://malika-birthday-git-aeos-progression-tyyr1.vercel.app
- Vercel's project metadata reports SSO protection on Vercel-hosted domains. A reviewer who is not already authorized may need the private shareable link or Vercel access.

## What was tested

The browser suite covered keyboard entry/navigation, heart-game completion and secret unlock, modal focus/Escape behavior, responsive overflow at 320/375/768px, reduced-motion support, Mimi reactions, the constellation/flower interactions, pointer-responsive ambience, and a six-frame screenshot journey.

## Known limitations

- Physical-device touch/viewport QA has not been performed.
- Screen-reader QA has not been performed.
- Screenshot capture and automated browser tests are not accessibility certification.
- Vercel's Ready state is deployment evidence; access still depends on the project's protection configuration.
