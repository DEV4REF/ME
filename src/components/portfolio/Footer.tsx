'use client';

import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import FadeIn from '@/components/primitives/FadeIn';
import { useLang } from '@/lib/i18n';
import { SOCIAL_LINKS } from '@/lib/translations';

export default function Footer() {
  const { t, lang } = useLang();
  const persian = lang === 'fa';
  const year = new Date().getFullYear();
  const headingFont = persian ? 'font-persian font-black' : 'font-display';

  const cols = [
    {
      title: t('footer.col.navigate'),
      links: [
        { label: t('nav.about'), href: '#about' },
        { label: t('nav.services'), href: '#services' },
        { label: t('nav.projects'), href: '#projects' },
        { label: t('nav.contact'), href: '#contact' },
      ],
    },
    {
      title: t('footer.col.practice'),
      links: [
        { label: t('services.01.title'), href: '#services' },
        { label: t('services.02.title'), href: '#services' },
        { label: t('services.03.title'), href: '#services' },
        { label: t('services.04.title'), href: '#services' },
      ],
    },
    {
      title: t('footer.col.connect'),
      links: [
        { label: t('contact.social.telegram'), href: SOCIAL_LINKS.telegram },
        { label: t('contact.social.github'), href: SOCIAL_LINKS.github },
        { label: t('contact.social.linkedin'), href: SOCIAL_LINKS.linkedin },
        { label: t('contact.social.email'), href: SOCIAL_LINKS.email },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-[rgba(215,226,234,0.1)] bg-[#0C0C0C] pb-10 pt-20 sm:pt-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16">
        {/* Top: massive wordmark */}
        <FadeIn direction="up" duration={1.2}>
          <div className="mb-16 flex flex-col items-start gap-8 border-b border-[rgba(215,226,234,0.1)] pb-16 md:flex-row md:items-end md:justify-between">
            <div>
              <span
                className={`text-[10px] uppercase tracking-[0.32em] text-[rgba(215,226,234,0.4)] ${
                  persian ? 'font-persian tracking-[0.1em]' : 'font-satoshi'
                }`}
                dir="ltr"
              >
                {t('footer.label')}
              </span>
              <h3
                className={`mt-4 ${headingFont} text-[20vw] uppercase leading-[0.85] text-[#D7E2EA] sm:text-[14vw] md:text-[11vw] lg:text-[10vw]`}
                style={{ letterSpacing: persian ? '0' : '-0.02em' }}
              >
                {t('footer.heading1')}
                <br />
                <span className="text-[#A89A82]">{t('footer.heading2')}</span>
              </h3>
            </div>

            <motion.a
              href="#top"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ y: -2 }}
              className={`group inline-flex items-center gap-3 rounded-full border border-[rgba(215,226,234,0.2)] px-5 py-3 text-[10px] uppercase tracking-[0.28em] text-[#D7E2EA] transition-colors duration-500 hover:border-[#A89A82] hover:text-[#A89A82] ${
                persian ? 'font-persian tracking-[0.05em]' : 'font-satoshi'
              }`}
            >
              {t('footer.backToTop')}
              <ArrowUp
                className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-1"
                strokeWidth={1.5}
              />
            </motion.a>
          </div>
        </FadeIn>

        {/* Middle: link columns */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 md:gap-8">
          {cols.map((col) => (
            <FadeIn key={col.title} direction="up" duration={0.8}>
              <div>
                <h4
                  className={`mb-5 text-[10px] uppercase tracking-[0.32em] text-[rgba(215,226,234,0.4)] ${
                    persian ? 'font-persian tracking-[0.1em]' : 'font-satoshi'
                  }`}
                >
                  {col.title}
                </h4>
                <ul className="flex flex-col gap-3">
                  {col.links.map((l, i) => (
                    <li key={`${l.label}-${i}`}>
                      <a
                        href={l.href}
                        target={l.href.startsWith('http') ? '_blank' : undefined}
                        rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
                        className={`group inline-flex items-center gap-2 text-sm text-[#D7E2EA] transition-colors duration-500 hover:text-[#A89A82] ${
                          persian ? 'font-persian' : 'font-satoshi'
                        }`}
                      >
                        <span className="h-px w-0 bg-[#A89A82] transition-all duration-500 group-hover:w-4" />
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Bottom: meta */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-[rgba(215,226,234,0.08)] pt-8 sm:flex-row sm:items-center">
          <span
            className={`text-[10px] uppercase tracking-[0.28em] text-[rgba(215,226,234,0.4)] ${
              persian ? 'font-persian tracking-[0.05em]' : 'font-satoshi'
            }`}
          >
            <span dir="ltr" style={{ unicodeBidi: 'isolate' }}>
              © {year}
            </span>{' '}
            {persian ? 'عارف · تمام حقوق محفوظ است' : `Aaref · All systems reserved`}
          </span>
          <div className="flex items-center gap-6">
            <span
              className={`text-[10px] uppercase tracking-[0.28em] text-[rgba(215,226,234,0.4)] ${
                persian ? 'font-persian tracking-[0.05em]' : 'font-satoshi'
              }`}
            >
              {t('footer.builtWith')}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A89A82] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#A89A82]" />
              </span>
              <span
                className={`text-[10px] uppercase tracking-[0.28em] text-[rgba(215,226,234,0.6)] ${
                  persian ? 'font-persian tracking-[0.05em]' : 'font-satoshi'
                }`}
              >
                {t('footer.online')}
              </span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
