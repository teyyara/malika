# Vercel deployment — Malika Birthday Universe

The app is a React + Vite single-page experience. Scene changes happen in React state at `/`; there are no server endpoints or separate client routes that need rewrite rules.

## Current deployment evidence

- **Vercel project:** [malika-birthday](https://vercel.com/tyyr1/malika-birthday)
- **GitHub repository:** [teyyara/malika](https://github.com/teyyara/malika)
- **Production commit:** `8fe4b6363a748f7987d17b8f9ede8e7682d4a9e8` on `main`
- **Production status:** Vercel reports **Ready**
- **Production aliases reported by Vercel:**
  - https://malika-birthday-kappa.vercel.app
  - https://malika-birthday-tyyr1.vercel.app
  - https://malika-birthday-git-main-tyyr1.vercel.app
- **Ready branch preview:** https://malika-birthday-git-aeos-progression-tyyr1.vercel.app
- **Vercel GitHub bot evidence:** [PR #2 deployment update](https://github.com/teyyara/malika/pull/2#issuecomment-6115512987)
- **Automated release run:** [Validate Malika · run 38188085348](https://github.com/teyyara/malika/actions/runs/38188085348)

Vercel's project metadata reports SSO protection enabled for Vercel-hosted domains (with custom domains excluded from that setting). A time-limited shareable bypass was generated for the intended reviewer on 12 October 2026. Its secret is deliberately not stored in this repository; use the private bypass URL supplied by the release operator if the reviewer cannot authenticate normally. Do not publish the bypass secret in GitHub issues, commits, or this file.

## Exact project settings

- **Framework preset:** Vite
- **Root directory:** `./` (repository root)
- **Install command:** `npm install` (default)
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Node.js:** Vercel project currently reports Node 24.x; package requires Node.js 20.19 or newer
- **Environment variables:** none
- **External or paid runtime APIs:** none

A custom `vercel.json` is intentionally omitted: the current app uses only the root browser path with React-managed scene state, so it does not need an SPA deep-link rewrite.

## Reviewer smoke test

1. Open the private preview link supplied by the release operator, or authenticate to Vercel if prompted.
2. Test the welcome, petting Mimi, the three-star constellation, ladybug/flower notes, seven-heart win, birthday letter, and final surprise.
3. Check a desktop viewport and a phone-sized viewport.
4. For mobile or screen-reader certification, use a real device and assistive technology; automated Chromium results are not a substitute.

## Privacy note

The HTML uses `noindex, nofollow` to discourage search indexing, but this is not access control. The shareable bypass URL is a bearer link: anyone who receives it can use it until it expires, so send it privately and do not commit it to the repository.
