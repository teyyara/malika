# Vercel deployment — Malika Birthday Universe

The app is a React + Vite single-page experience. Scene changes happen in React state at `/`; there are no server endpoints or separate client routes that need rewrite rules.

## Current deployment evidence

- **Vercel project:** [malika-birthday](https://vercel.com/tyyr1/malika-birthday)
- **GitHub repository:** [teyyara/malika](https://github.com/teyyara/malika)
- **Production branch to verify:** `main`
- **Vercel-reported Ready preview:** https://malika-birthday-git-aeos-progression-tyyr1.vercel.app
- **Vercel bot evidence:** [PR #2 deployment update](https://github.com/teyyara/malika/pull/2#issuecomment-6115512987)
- **Validated app checkpoint:** `8fe4b6363a748f7987d17b8f9ede8e7682d4a9e8`
- **Automated release run:** [Validate Malika · run 38188085348](https://github.com/teyyara/malika/actions/runs/38188085348)

The Preview URL above was posted by Vercel's GitHub integration with status **Ready** after the final source candidate was pushed. It is a public, shareable HTTPS preview. The Vercel production/custom-domain alias is not separately recorded in the available deployment status, so do not infer that a common project-name URL is the production alias.

## Exact project settings

- **Framework preset:** Vite
- **Root directory:** `./` (repository root)
- **Install command:** `npm install` (default)
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Node.js:** a supported Node 22 runtime; package requires Node.js 20.19 or newer
- **Environment variables:** none
- **External or paid runtime APIs:** none

A custom `vercel.json` is intentionally omitted: the current app uses only the root browser path with React-managed scene state, so it does not need an SPA deep-link rewrite.

## Confirm the production URL

1. Open the [Vercel project dashboard](https://vercel.com/tyyr1/malika-birthday).
2. In **Settings → Git**, confirm the production branch is `main`.
3. Open **Deployments** and select the newest deployment associated with the latest `main` commit. Wait for its status to be **Ready**, then use Vercel's **Visit** action.
4. If a stable production domain is assigned, inspect **Settings → Domains** and copy the exact domain Vercel lists. Do not substitute a guessed `*.vercel.app` hostname.
5. On the production URL, verify the welcome, petting Mimi, the three-star constellation, ladybug/flower notes, seven-heart win, birthday letter, and final surprise on desktop and a phone-sized viewport.
6. For an immediate share while confirming the production alias, the Vercel-reported Ready preview above is the known HTTPS URL.

No new Vercel project import is necessary: the GitHub/Vercel project integration is already present. If that integration is later disconnected, use [Vercel New Project](https://vercel.com/new) to import `teyyara/malika` and apply the settings above.

## Privacy note

The HTML uses `noindex, nofollow` to discourage search indexing, but this is not access control. Anyone with the shareable URL can open the birthday site.
