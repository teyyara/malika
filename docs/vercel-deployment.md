# Deploy the Malika Birthday Universe to Vercel

The app is a React + Vite single-page experience. Scene changes happen in React state at `/`; there are no server endpoints or separate client routes that need rewrite rules.

## Project settings

- **Git repository:** `teyyara/malika`
- **Production branch:** `main`
- **Framework preset:** Vite
- **Root directory:** `./` (repository root)
- **Install command:** `npm install` (default)
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Node.js:** use a supported Node 22 runtime (the package requires Node.js 20.19 or newer)
- **Environment variables:** none
- **Paid/runtime APIs:** none

A custom `vercel.json` is intentionally omitted because the current single-page experience does not use deep client routes or server functions. The Vite framework preset supplies the build/output defaults; the explicit values above match this repository.

## Import the repository

1. Open [Vercel New Project](https://vercel.com/new) and sign in.
2. Import the GitHub repository **teyyara/malika**. If it is not offered, authorize Vercel to access this repository from GitHub.
3. Set the project name to `malika-birthday-universe` (or another available name).
4. Confirm Framework Preset = **Vite**, Build Command = `npm run build`, and Output Directory = `dist`. Keep the Root Directory at the repository root.
5. Do not add environment variables; this app has none.
6. Deploy and wait for Vercel's deployment status to report success.
7. Open the assigned HTTPS production domain and verify the welcome screen, petting Mimi, the garden's three-star constellation, ladybug/flower notes, seven-heart win, and birthday letter on both desktop and mobile widths.
8. Share that confirmed HTTPS URL with Malika.

## Access and verification

Vercel project creation/deployment has **not** been performed from this workspace because the Vercel integration is not connected here. This file is a ready-to-follow deployment recipe, not evidence of a live deployment. Keep the site URL private if you prefer; the HTML intentionally uses `noindex, nofollow`, but that is a search-engine directive, not access control.
