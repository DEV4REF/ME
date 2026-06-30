"use client";

import { useEffect } from "react";

/**
 * Registers the service worker using a relative URL so it resolves
 * correctly under any base path (root domain or GitHub Pages subpath).
 */
export function RegisterSW() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    // Relative path -> resolves against the current page URL, so it works
    // whether the site lives at "/" or "/ME/".
    const swUrl = new URL("sw.js", window.location.href).toString();

    navigator.serviceWorker
      .register(swUrl, { scope: "./" })
      .catch((err) => console.warn("Service worker registration failed:", err));
  }, []);

  return null;
}
