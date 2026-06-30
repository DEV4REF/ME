import type { NextConfig } from "next";

/**
 * Next.js config optimized for GitHub Pages static hosting.
 *
 * Key settings:
 * - `output: "export"` — generates fully static HTML/CSS/JS in `out/`
 * - `images.unoptimized: true` — GitHub Pages has no image optimization server
 * - `basePath` — set via GITHUB_PAGES_BASE_PATH env var (e.g. "/repo-name")
 *   so assets resolve correctly when hosted at username.github.io/repo-name
 * - `trailingSlash: true` — GitHub Pages serves /path/index.html for /path/
 *
 * The GitHub API is called directly from the client (browser) using CORS,
 * so no server-side API route is needed — everything is static.
 */
const isGithubPages = process.env.DEPLOY_TARGET === "github-pages";
const basePath = process.env.GITHUB_PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages
  output: isGithubPages ? "export" : "standalone",

  // GitHub Pages can't optimize images server-side
  images: {
    unoptimized: true,
  },

  // Serve /path/ as /path/index.html (GitHub Pages convention)
  trailingSlash: true,

  // Base path for when the site is hosted at username.github.io/repo-name
  // Empty string = hosted at root (username.github.io)
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),

  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
