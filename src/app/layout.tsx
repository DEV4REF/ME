import type { Metadata } from "next";
import { Anton, Vazirmatn } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aaref | عارف — Programmer & Digital Builder",
  description:
    "Building high-quality digital systems, web applications, automation tools and meaningful user experiences.",
  keywords: [
    "Aaref",
    "عارف",
    "Programmer",
    "Digital Builder",
    "Web Developer",
    "Automation",
    "Systems",
    "Portfolio",
    "dev4ref",
  ],
  authors: [{ name: "Aaref" }],
  openGraph: {
    title: "Aaref | عارف — Programmer & Digital Builder",
    description:
      "Building high-quality digital systems, web applications, automation tools and meaningful user experiences.",
    siteName: "Aaref | عارف",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aaref | عارف — Programmer & Digital Builder",
    description:
      "Building high-quality digital systems, web applications, automation tools and meaningful user experiences.",
  },
};

/**
 * Combined inline script:
 * 1. Reads language preference from localStorage and sets dir/lang on <html>
 *    BEFORE React hydrates — prevents RTL flash.
 * 2. Adds `js-ready` class to <html> so the CSS safety net (below) stops
 *    overriding Framer Motion's inline opacity:0 / transform styles.
 *
 * This script runs synchronously in <head> before the body renders, so:
 * - Content is visible immediately (safety net CSS makes opacity:0 elements visible)
 * - Once JS executes, the safety net is removed and Framer Motion takes over
 */
const INIT_SCRIPT = `
(function(){
  try {
    var lang = localStorage.getItem('aaref-lang') || 'en';
    var dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  } catch(e) {}
  document.documentElement.classList.add('js-ready');
})();
`;

/**
 * CSS safety net — injected into <head> BEFORE any body content renders.
 *
 * Problem: Framer Motion renders `initial={{ opacity: 0 }}` as an inline
 * `style="opacity:0"` in the server HTML. If client-side JS is delayed or
 * fails (e.g. in a slow preview iframe), content stays invisible forever.
 *
 * Solution: Before the `js-ready` class is added (i.e. before JS executes),
 * override ALL inline opacity:0 and transform styles to make content visible.
 * Once JS runs and adds `js-ready`, the override is removed and Framer Motion
 * controls the animations normally.
 */
const SAFETY_NET_CSS = `
  html:not(.js-ready) [style*="opacity:0"] {
    opacity: 1 !important;
  }
  html:not(.js-ready) [style*="opacity: 0"] {
    opacity: 1 !important;
  }
  html:not(.js-ready) [style*="transform:"] {
    transform: none !important;
  }
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        {/* Safety net CSS — must run before body renders */}
        <style dangerouslySetInnerHTML={{ __html: SAFETY_NET_CSS }} />
        {/* Init script — sets dir/lang + js-ready class */}
        <script dangerouslySetInnerHTML={{ __html: INIT_SCRIPT }} />
        {/* Satoshi from Fontshare (not on Google Fonts) */}
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${anton.variable} ${vazirmatn.variable} antialiased bg-[#0C0C0C] text-[#D7E2EA] overflow-x-clip`}
        style={{ backgroundColor: "#0C0C0C", color: "#D7E2EA" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
