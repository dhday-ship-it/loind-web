# LOIND

React + TypeScript + Vite SPA for [loind.com](https://loind.com), deployed to GitHub Pages.

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run lint      # oxlint
npm run preview   # preview the production build locally
```

## Structure

- `src/pages/` — one folder per route (`HomePage`, `AboutPage`, `ServicePage`, `StoryPage`, `ContactPage`, `AdminPage`), each with a co-located CSS module.
- `src/components/layout/` — shared `Header`/`Footer`/`Layout` wrapping the public routes.
- `src/firebase.ts` — Firebase (Firestore/Storage/Auth) config, shared across pages.
- `src/hooks/useStories.ts` — Firestore stories query hook.
- `public/` — static assets (images/video) served at the root, plus `CNAME` and the GitHub Pages SPA `404.html` redirect.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the app and publishes `dist/` to GitHub Pages. The repository's Settings → Pages source must be set to "GitHub Actions" for this to take effect.
