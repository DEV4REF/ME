# Aaref | عارف — Portfolio

A premium, minimalist, high-end personal portfolio website built with React 19, TypeScript, Next.js 16, Tailwind CSS, Framer Motion, and Lucide React.

Bilingual (English / Persian RTL) with live GitHub repository integration.

---

## Deploy to GitHub Pages

This site is configured for **fully static** deployment to GitHub Pages.

### One-time setup

1. **Push this repo to GitHub** (if not already).

2. **Enable GitHub Pages with Actions source:**
   - Go to **Repo → Settings → Pages**
   - Under **Build and deployment → Source**, select **GitHub Actions**

3. **Set the base path** (only if hosting at `username.github.io/repo-name`):
   - Go to **Repo → Settings → Secrets and variables → Actions → Variables tab**
   - Add a variable: `GITHUB_PAGES_BASE_PATH` = `/your-repo-name`
   - If hosting at a **custom domain** or `username.github.io` (root repo), **leave it unset** — no base path needed.

### Deploy

Push to `main` — the GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:
1. Installs dependencies
2. Builds the static site (`npm run build:github-pages`)
3. Adds `.nojekyll` (so GitHub Pages doesn't ignore `_next/` files)
4. Uploads and deploys to GitHub Pages

Your site goes live at `https://username.github.io/repo-name/` (or your custom domain).

### Optional: GitHub API token (higher rate limits)

GitHub's API allows 60 unauthenticated requests/hour per IP. For higher limits (5000/hr), add a read-only token:

1. Go to **GitHub → Settings → Developer settings → Fine-grained personal access tokens**
2. Generate a token with **Public Repositories (read-only)** access
3. Add it as a repo secret: `NEXT_PUBLIC_GITHUB_TOKEN`
   - **Repo → Settings → Secrets and variables → Actions → Secrets tab**

This is optional — the site works fine without it for typical traffic.

---

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`

## Build for GitHub Pages locally

```bash
# If hosting at username.github.io/repo-name:
GITHUB_PAGES_BASE_PATH=/repo-name npm run build:github-pages

# If hosting at root (username.github.io or custom domain):
npm run build:github-pages
```

The static site is output to `out/` — you can serve it locally with:
```bash
npx serve out
```

---

## Tech stack

- **Framework:** Next.js 16 (static export mode for GitHub Pages)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Fonts:** Anton (display, EN), Vazirmatn (Persian), Satoshi (body, EN)
- **i18n:** Custom bilingual EN ⇄ FA system with RTL support
- **GitHub integration:** Direct client-side fetch via CORS (no server needed)

## Features

- 🎬 Cinematic, luxury aesthetic (Yeezy / DONDA / Apple / A24 inspired)
- 🌐 Bilingual: English (LTR) and Persian (RTL) with elegant literary copy
- 📡 Live GitHub repos — real-time data from `dev4ref` account
- 🎯 Magnetic hover effects, scroll-driven animations, character-by-character text reveal
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Static export — no server needed, deploys anywhere
- 🔍 SEO optimized with proper meta tags, OpenGraph, Twitter cards
