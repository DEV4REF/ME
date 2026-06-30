'use client';

import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useState } from 'react';
import { Languages } from 'lucide-react';
import Magnet from '@/components/primitives/Magnet';
import { useLang, toPersianDigits } from '@/lib/i18n';

export default function Navbar() {
  const { t, lang, setLang } = useLang();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (latest > prev && latest > 240) setHidden(true);
    else setHidden(false);
    setScrolled(latest > 80);
  });

  const links = [
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.services'), href: '#services' },
    { label: t('nav.projects'), href: '#projects' },
    { label: t('nav.contact'), href: '#contact' },
  ];

  return (
    <motion.header
      initial={{ y: -120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <motion.nav
        animate={{ y: hidden ? -120 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`flex items-center justify-between px-5 sm:px-8 md:px-12 lg:px-16 transition-colors duration-700 ${
          scrolled
            ? 'bg-[#0C0C0C]/70 backdrop-blur-xl border-b border-[rgba(215,226,234,0.08)]'
            : 'bg-transparent'
        }`}
        style={{ paddingTop: '1.1rem', paddingBottom: '1.1rem' }}
      >
        {/* Logo / Monogram */}
        <Magnet as="a" href="#top" strength={10} className="group inline-flex items-center gap-3">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(215,226,234,0.2)] font-display text-lg text-[#D7E2EA] transition-colors duration-500 group-hover:border-[#A89A82] group-hover:text-[#A89A82]">
            A
          </span>
          <span className="hidden sm:inline-flex font-satoshi text-[11px] uppercase tracking-[0.32em] text-[#D7E2EA] transition-opacity duration-500 group-hover:opacity-60" dir="ltr">
            Aaref<span className="mx-2 opacity-30">|</span>عارف
          </span>
        </Magnet>

        {/* Links */}
        <ul className="hidden md:flex items-center gap-9">
          {links.map((l, i) => (
            <motion.li
              key={l.href}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <a
                href={l.href}
                className="group relative font-satoshi text-[11px] uppercase tracking-[0.28em] font-medium text-[#D7E2EA] transition-opacity duration-300 hover:opacity-70"
              >
                <span className={lang === 'fa' ? 'font-persian' : ''}>
                  {lang === 'fa' ? l.label : l.label}
                </span>
                <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-0 bg-[#A89A82] transition-all duration-500 ease-premium group-hover:w-full" />
              </a>
            </motion.li>
          ))}
        </ul>

        {/* Right cluster: status + language toggle + mobile build */}
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <div className="inline-flex items-center rounded-full border border-[rgba(215,226,234,0.12)] p-0.5">
            <button
              onClick={() => setLang('en')}
              aria-label="English"
              className={`px-2.5 py-1 rounded-full font-satoshi text-[10px] uppercase tracking-[0.15em] transition-colors duration-300 ${
                lang === 'en'
                  ? 'bg-[#D7E2EA] text-[#0C0C0C]'
                  : 'text-[rgba(215,226,234,0.5)] hover:text-[#D7E2EA]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('fa')}
              aria-label="فارسی"
              className={`px-2.5 py-1 rounded-full font-persian text-[10px] tracking-[0.05em] transition-colors duration-300 ${
                lang === 'fa'
                  ? 'bg-[#D7E2EA] text-[#0C0C0C]'
                  : 'text-[rgba(215,226,234,0.5)] hover:text-[#D7E2EA]'
              }`}
            >
              فا
            </button>
          </div>

          {/* Status pill */}
          <span className="hidden lg:inline-flex items-center gap-2 rounded-full border border-[rgba(215,226,234,0.12)] px-3 py-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A89A82] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#A89A82]" />
            </span>
            <span
              className={`font-satoshi text-[10px] uppercase tracking-[0.25em] text-[rgba(215,226,234,0.7)] ${
                lang === 'fa' ? 'font-persian tracking-normal' : ''
              }`}
            >
              {t('nav.available')}
            </span>
          </span>

          {/* Mobile build pill */}
          <a
            href="#contact"
            className={`md:hidden inline-flex items-center gap-2 rounded-full bg-[#D7E2EA] px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-[#0C0C0C] ${
              lang === 'fa' ? 'font-persian tracking-normal' : 'font-satoshi'
            }`}
          >
            {t('nav.build')}
          </a>
        </div>
      </motion.nav>
    </motion.header>
  );
}
